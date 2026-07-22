package dev.kali.labendicion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.time.OffsetDateTime;
import java.util.stream.Collectors;
import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;

import dev.kali.labendicion.domain.entity.*;
import dev.kali.labendicion.repository.*;
import dev.kali.labendicion.service.EventService;
import dev.kali.labendicion.service.RegistroValidationService;
import dev.kali.labendicion.util.CsvListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/frontend")
public class FrontendController {

    @Autowired
    private ProductoRepository productoRepo;

    @Autowired
    private EmpleadoRepository empleadoRepo;

    @Autowired
    private RegistroRepository registroRepo;

    @Autowired
    private TareaAseoRepository tareaAseoRepo;

    @Autowired
    private RegistroAseoRepository registroAseoRepo;

    @Autowired
    private EmpresaRepository empresaRepo;

    @Autowired
    private PasoProduccionRepository pasoRepo;

    @Autowired
    private EventService eventService;

    @Autowired
    private AccionProduccionRepository accionProduccionRepo;

    @Autowired
    private CargoEmpleadoRepository cargoRepo;

    @Autowired
    private AreaTrabajoRepository areaTrabajoRepo;

    @Autowired
    private AccionAseoRepository accionAseoRepo;

    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepo;

    @Autowired
    private MovimientoFinancieroRepository movimientoFinancieroRepo;

    @Autowired
    private RegistroValidationService registroValidation;
    
    @Autowired
    private Validator validator;

    @GetMapping("/bootstrap")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<Object> bootstrap() {
        seedCatalogsIfEmpty();

        // Cargar productos con pasos en una sola consulta para evitar lazy init
        List<Producto> productos = productoRepo.findAllWithPasosOrderByNombre();

        // Empresas: cargar todas (normalmente son pocas)
        List<Empresa> empresas = empresaRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getRazonSocial().compareTo(b.getRazonSocial()))
                .collect(Collectors.toList());

        // Empleados: cargar todos (normalmente son <= 100)
        List<Empleado> empleados = empleadoRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getNombre().compareTo(b.getNombre()))
                .collect(Collectors.toList());

        // Registros: cargar últimos 100 para evitar queries gigantescas
        // En Render/Supabase si tienes miles de registros, esto es crucial
        List<Registro> registros = registroRepo.findAllWithProduccionesOrderByFechaDesc();
        if (registros.size() > 100) {
            registros = registros.stream().limit(100).collect(Collectors.toList());
        }

        // Registros de aseo: cargar con entries (evita lazy init en serialización)
        List<dev.kali.labendicion.domain.entity.RegistroAseo> registrosAseo = registroAseoRepo.findAllWithEntriesOrderByFechaDesc();
        // Opcionalmente, si tienes miles de tareas, cargar solo las últimas 50:
        // if (tareasAseo.size() > 50) { tareasAseo = tareasAseo.stream().limit(50).collect(Collectors.toList()); }

        // Transformar a DTOs planos mientras la sesión está abierta para evitar LazyInitializationException
        var productosDto = productos.stream().map(p -> {
            var pasosDto = p.getPasos() == null ? List.<Object>of() : p.getPasos().stream().map(ps -> {
                var map = new java.util.HashMap<String, Object>();
                map.put("id", ps.getId());
                map.put("accionProduccionId", ps.getAccionProduccionId());
                map.put("descripcion", ps.getDescripcion());
                map.put("metaUnidadesHora", ps.getMetaUnidadesHora());
                map.put("completado", ps.getCompletado());
                map.put("valorPorUnidad", ps.getValorPorUnidad());
                return map;
            }).collect(Collectors.toList());
            var map = new java.util.HashMap<String, Object>();
            map.put("id", p.getId());
            map.put("nombre", p.getNombre());
            map.put("cantidad", p.getCantidad());
            map.put("empresa", p.getEmpresa());
            map.put("ganancia", p.getGanancia());
            map.put("fechaAsignacion", p.getFechaAsignacion());
            map.put("fechaTerminacion", p.getFechaTerminacion());
            map.put("estado", p.getEstado());
            map.put("pasos", pasosDto);
            return map;
        }).collect(Collectors.toList());

        var registrosDto = registros.stream().map(r -> {
            var prodDto = (r.getProducciones() == null) ? List.<Object>of() : r.getProducciones().stream().map(pr -> {
                var m = new java.util.HashMap<String, Object>();
                m.put("productoId", pr.getProductoId());
                m.put("pasoId", pr.getPasoId());
                m.put("unidadesTotales", pr.getUnidadesTotales());
                m.put("unidadesBuenas", pr.getUnidadesBuenas());
                return m;
            }).collect(Collectors.toList());
            var m2 = new java.util.HashMap<String, Object>();
            m2.put("id", r.getId());
            m2.put("empleadoId", r.getEmpleadoId());
            m2.put("fecha", r.getFecha());
            m2.put("horaEntrada", r.getHoraEntrada());
            m2.put("horaSalida", r.getHoraSalida());
            m2.put("unidadesTotales", r.getUnidadesTotales());
            m2.put("unidadesBuenas", r.getUnidadesBuenas());
            m2.put("valorHora", r.getValorHora());
            m2.put("tipoPago", r.getTipoPago());
            m2.put("producciones", prodDto);
            return m2;
        }).collect(Collectors.toList());

        // Empleados, tareas y empresas: serializables simples
        var empleadosDto = empleados.stream().map(e -> {
            var m = new java.util.HashMap<String, Object>();
            m.put("id", e.getId()); m.put("nombre", e.getNombre()); m.put("cargo", e.getCargo()); m.put("tipoDocumento", e.getTipoDocumento()); m.put("documento", e.getDocumento()); m.put("telefono", e.getTelefono()); m.put("email", e.getEmail()); m.put("fechaIngreso", e.getFechaIngreso()); m.put("estado", e.getEstado());
            return m;
        }).collect(Collectors.toList());

        // Convertir registros de aseo a DTOs planos
        var tareasDto = registrosAseo.stream().map(r -> {
            var entries = r.getEntries() == null ? List.<Object>of() : r.getEntries().stream().map(e -> {
                var me = new java.util.HashMap<String, Object>();
                me.put("id", e.getId());
                me.put("empleadoId", e.getEmpleadoId());
                me.put("empleadoNombre", e.getEmpleadoNombre());
                me.put("acciones", CsvListUtil.fromCsv(e.getAccionesCsv()));
                me.put("areas", CsvListUtil.fromCsv(e.getAreasCsv()));
                me.put("completada", e.isCompletada());
                return me;
            }).collect(Collectors.toList());
            var m = new java.util.HashMap<String, Object>();
            m.put("id", r.getId());
            m.put("fecha", r.getFecha());
            m.put("entries", entries);
            return m;
        }).collect(Collectors.toList());

        var empresasDto = empresas.stream().map(emp -> {
            var m = new java.util.HashMap<String, Object>();
            m.put("id", emp.getId()); m.put("razonSocial", emp.getRazonSocial()); m.put("telefono", emp.getTelefono()); m.put("correo", emp.getCorreo()); m.put("direccion", emp.getDireccion()); m.put("estado", emp.getEstado());
            return m;
        }).collect(Collectors.toList());

        var movimientosDto = movimientoFinancieroRepo.findAllByOrderByMesDescFechaDesc().stream().map(this::mapMovimientoToDto).collect(Collectors.toList());

        var response = new java.util.HashMap<String, Object>();
        response.put("productos", productosDto);
        response.put("empleados", empleadosDto);
        response.put("registros", registrosDto);
        response.put("registrosAseo", tareasDto);
        response.put("empresas", empresasDto);
        response.put("movimientosFinancieros", movimientosDto);
        response.put("accionesProduccion", accionProduccionRepo.findAllByOrderByOrdenAscNombreAsc());
        response.put("cargos", cargoRepo.findAllByOrderByNombreAsc());
        response.put("areasTrabajo", areaTrabajoRepo.findAllByOrderByNombreAsc());
        response.put("accionesAseo", accionAseoRepo.findAllByOrderByNombreAsc());
        response.put("tiposDocumento", tipoDocumentoRepo.findAllByOrderByNombreAsc());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/productos")
    @Transactional
    public ResponseEntity<?> crearProducto(@RequestBody java.util.Map<String, Object> body) {
        try {
            Producto producto = new Producto();
            producto.setId(body.getOrDefault("id", generateId()).toString());
            producto.setNombre((String) body.getOrDefault("nombre", ""));
            producto.setCantidad(body.get("cantidad") == null ? null : Integer.parseInt(body.get("cantidad").toString()));
            producto.setEmpresa((String) body.getOrDefault("empresa", ""));
            producto.setGanancia(body.get("ganancia") == null ? null : Integer.parseInt(body.get("ganancia").toString()));
            producto.setFechaAsignacion((String) body.getOrDefault("fechaAsignacion", ""));
            producto.setFechaTerminacion((String) body.getOrDefault("fechaTerminacion", ""));
            producto.setEstado((String) body.getOrDefault("estado", "Pendiente"));

            Set<ConstraintViolation<Producto>> violations = validator.validate(producto);
            if (!violations.isEmpty()) {
                String msg = violations.iterator().next().getMessage();
                return ResponseEntity.badRequest().body(Map.of("error", msg));
            }

            if (producto.getFechaTerminacion() != null && !producto.getFechaTerminacion().isBlank() && 
                producto.getFechaAsignacion() != null && !producto.getFechaAsignacion().isBlank()) {
                if (producto.getFechaTerminacion().compareTo(producto.getFechaAsignacion()) < 0) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La fecha límite no puede ser anterior a la fecha de asignación."));
                }
            }

            Producto guardado = productoRepo.save(producto);

            // Procesar pasos como entidades relacionales
            Object pasosObj = body.get("pasos");
            if (pasosObj != null && pasosObj instanceof java.util.List) {
                java.util.List<?> pasosList = (java.util.List<?>) pasosObj;
                for (Object paso : pasosList) {
                    if (paso instanceof java.util.Map) {
                        java.util.Map<String, Object> pasoMap = (java.util.Map<String, Object>) paso;
                        PasoProduccion nuevoPaso = new PasoProduccion();
                        nuevoPaso.setId(generateId());
                        nuevoPaso.setProducto(guardado);
                        aplicarDatosPaso(nuevoPaso, pasoMap);
                        pasoRepo.save(nuevoPaso);
                    }
                }
                // Recargar producto con pasos
                guardado = productoRepo.findById(guardado.getId()).orElse(guardado);
            }

            // Actualizar estado de empresa asociada si existe
            if (producto.getEmpresa() != null && !producto.getEmpresa().isBlank()) {
                List<Empresa> matches = empresaRepo.findByRazonSocial(producto.getEmpresa());
                for (Empresa emp : matches) {
                    emp.setEstado("Ordenes pendientes");
                    empresaRepo.save(emp);
                }
            }

            Map<String, Object> dto = mapProductoToDto(guardado);
            // Emitir evento en tiempo real a clientes SSE
            eventService.emitAsync("PRODUCTO_CREADO", dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/productos");
        }
    }

    @PatchMapping("/productos/{id}/estado")
    @Transactional
    public ResponseEntity<?> actualizarEstadoProducto(@PathVariable String id, @RequestBody java.util.Map<String, Object> body) {
        if (!productoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            Producto actual = productoRepo.findById(id).orElseThrow();
            if (body.containsKey("estado")) {
                String nuevoEstado = body.get("estado").toString();
                if ("Terminado".equals(nuevoEstado)) {
                    if (actual.getPasos() != null && !actual.getPasos().isEmpty() && actual.getCantidad() != null) {
                        Map<String, Integer> acumulado = new java.util.HashMap<>();
                        for (Registro r : registroRepo.findAll()) {
                            if (r.getProducciones() != null) {
                                for (var p : r.getProducciones()) {
                                    if (id.equals(p.getProductoId())) {
                                        acumulado.merge(p.getPasoId(), p.getUnidadesTotales() == null ? 0 : p.getUnidadesTotales(), Integer::sum);
                                    }
                                }
                            }
                        }
                        for (var paso : actual.getPasos()) {
                            int sum = acumulado.getOrDefault(paso.getId(), 0);
                            if (sum < actual.getCantidad()) {
                                return ResponseEntity.badRequest().body(Map.of("error", "No se puede terminar la orden: el paso " + paso.getDescripcion() + " solo tiene " + sum + " unidades reportadas de " + actual.getCantidad() + " requeridas."));
                            }
                        }
                    }
                }
                actual.setEstado(nuevoEstado);
            }
            // Si se marca como Terminado, guardar fechaEntregaReal (default: hoy)
            if ("Terminado".equals(actual.getEstado())) {
                String fechaEntrega = body.containsKey("fechaEntregaReal") && body.get("fechaEntregaReal") != null
                        ? body.get("fechaEntregaReal").toString()
                        : null;
                if (fechaEntrega == null || fechaEntrega.isBlank()) {
                    fechaEntrega = java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")).toString();
                }
                actual.setFechaEntregaReal(fechaEntrega);
            }
            Producto guardado = productoRepo.save(actual);
            Map<String, Object> dto = mapProductoToDto(guardado);
            eventService.emitAsync("PRODUCTO_ESTADO_ACTUALIZADO", dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/productos/" + id + "/estado");
        }
    }

    @PutMapping("/productos/{id}")
    @Transactional
    public ResponseEntity<?> actualizarProducto(@PathVariable String id, @RequestBody java.util.Map<String, Object> body) {
        if (!productoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            Producto actual = productoRepo.findById(id).orElseThrow();
            actual.setNombre((String) body.getOrDefault("nombre", actual.getNombre()));
            if (body.containsKey("cantidad")) actual.setCantidad(body.get("cantidad") == null ? null : Integer.parseInt(body.get("cantidad").toString()));
            if (body.containsKey("empresa")) actual.setEmpresa((String) body.get("empresa"));
            if (body.containsKey("ganancia")) actual.setGanancia(body.get("ganancia") == null ? null : Integer.parseInt(body.get("ganancia").toString()));
            actual.setFechaAsignacion((String) body.getOrDefault("fechaAsignacion", actual.getFechaAsignacion()));
            actual.setFechaTerminacion((String) body.getOrDefault("fechaTerminacion", actual.getFechaTerminacion()));
            actual.setEstado((String) body.getOrDefault("estado", actual.getEstado()));

            Set<ConstraintViolation<Producto>> violations = validator.validate(actual);
            if (!violations.isEmpty()) {
                String msg = violations.iterator().next().getMessage();
                return ResponseEntity.badRequest().body(Map.of("error", msg));
            }

            if (actual.getFechaTerminacion() != null && !actual.getFechaTerminacion().isBlank() && 
                actual.getFechaAsignacion() != null && !actual.getFechaAsignacion().isBlank()) {
                if (actual.getFechaTerminacion().compareTo(actual.getFechaAsignacion()) < 0) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La fecha límite no puede ser anterior a la fecha de asignación."));
                }
            }

            // Procesar pasos entrantes preservando IDs
            Object pasosObj = body.get("pasos");
            if (pasosObj != null && pasosObj instanceof java.util.List) {
                java.util.List<?> pasosList = (java.util.List<?>) pasosObj;
                
                // Mapear los pasos entrantes
                java.util.Map<String, java.util.Map<String, Object>> incomingMap = new java.util.HashMap<>();
                for (Object paso : pasosList) {
                    if (paso instanceof java.util.Map) {
                        java.util.Map<String, Object> p = (java.util.Map<String, Object>) paso;
                        if (p.containsKey("id") && p.get("id") != null && !p.get("id").toString().isBlank()) {
                            incomingMap.put(p.get("id").toString(), p);
                        } else {
                            // Asignar ID temporal para nuevos
                            incomingMap.put("NEW_" + java.util.UUID.randomUUID().toString(), p);
                        }
                    }
                }
                
                if (actual.getPasos() == null) {
                    actual.setPasos(new java.util.ArrayList<>());
                }

                // Actualizar existentes, remover faltantes
                java.util.Iterator<PasoProduccion> iterator = actual.getPasos().iterator();
                while (iterator.hasNext()) {
                    PasoProduccion existente = iterator.next();
                    if (incomingMap.containsKey(existente.getId())) {
                        aplicarDatosPaso(existente, incomingMap.get(existente.getId()));
                        incomingMap.remove(existente.getId());
                    } else {
                        iterator.remove();
                    }
                }
                
                // Añadir los nuevos
                for (java.util.Map<String, Object> newPasoMap : incomingMap.values()) {
                    PasoProduccion nuevoPaso = new PasoProduccion();
                    nuevoPaso.setId(generateId());
                    nuevoPaso.setProducto(actual);
                    aplicarDatosPaso(nuevoPaso, newPasoMap);
                    actual.getPasos().add(nuevoPaso);
                }
            } else {
                if (actual.getPasos() != null) {
                    actual.getPasos().clear();
                }
            }

            // Guardar una sola vez: Hibernate manejará la cascada y eliminará/insertará pasos automaticamente
            Producto guardado = productoRepo.save(actual);

            // Actualizar estado de empresa asociada (si se cambió empresa)
            if (actual.getEmpresa() != null && !actual.getEmpresa().isBlank()) {
                List<Empresa> matches = empresaRepo.findByRazonSocial(actual.getEmpresa());
                for (Empresa emp : matches) {
                    emp.setEstado("Ordenes pendientes");
                    empresaRepo.save(emp);
                }
            }

            Map<String, Object> dto = mapProductoToDto(guardado);
            eventService.emitAsync("PRODUCTO_ACTUALIZADO", dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/productos/" + id);
        }
    }

    @DeleteMapping("/productos/{id}")
    @Transactional
    public ResponseEntity<?> eliminarProducto(@PathVariable String id) {
        boolean tieneReportes = registroRepo.findAll().stream()
                .filter(r -> r.getProducciones() != null)
                .anyMatch(r -> r.getProducciones().stream().anyMatch(p -> id.equals(p.getProductoId())));
        
        if (tieneReportes) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se puede eliminar esta orden de producción porque ya tiene reportes de trabajo (evaluaciones) asociados."));
        }

        Producto producto = productoRepo.findById(id).orElse(null);
        if (producto == null) {
            return ResponseEntity.noContent().build();
        }
        String nombreEmpresa = producto.getEmpresa();

        productoRepo.delete(producto);
        productoRepo.flush();
        
        // Actualizar estado de empresa asociada si ya no tiene órdenes
        if (nombreEmpresa != null && !nombreEmpresa.isBlank()) {
            boolean tieneMas = productoRepo.findAll().stream()
                    .anyMatch(p -> nombreEmpresa.equals(p.getEmpresa()));
            if (!tieneMas) {
                empresaRepo.findByRazonSocial(nombreEmpresa).forEach(emp -> {
                    emp.setEstado("Sin ordenes");
                    empresaRepo.save(emp);
                });
            }
        }
        
        eventService.emitAsync("PRODUCTO_ELIMINADO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    // Empresas CRUD
    @GetMapping("/empresas")
    public ResponseEntity<List<Empresa>> listarEmpresas() {
        return ResponseEntity.ok(empresaRepo.findAll());
    }

    @PostMapping("/empresas")
    public ResponseEntity<Empresa> crearEmpresa(@RequestBody Empresa empresa) {
        if (empresa.getId() == null) empresa.setId(generateId());
        Empresa saved = empresaRepo.save(empresa);
        eventService.emitAsync("EMPRESA_CREADA", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/empresas/{id}")
    public ResponseEntity<Empresa> actualizarEmpresa(@PathVariable String id, @RequestBody Empresa empresa) {
        if (!empresaRepo.existsById(id)) return ResponseEntity.notFound().build();
        empresa.setId(id);
        Empresa saved = empresaRepo.save(empresa);
        eventService.emitAsync("EMPRESA_ACTUALIZADA", saved);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/empresas/{id}")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable String id) {
        empresaRepo.deleteById(id);
        eventService.emitAsync("EMPRESA_ELIMINADA", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/empleados")
    public ResponseEntity<?> crearEmpleado(@RequestBody Empleado empleado) {
        if (empleado.getId() == null) {
            empleado.setId(generateId());
        }
        
        Set<ConstraintViolation<Empleado>> violations = validator.validate(empleado);
        if (!violations.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", violations.iterator().next().getMessage()));
        }
        
        if (empleadoRepo.findByDocumento(empleado.getDocumento()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ya existe un empleado con este documento."));
        }
        
        if (empleado.getFechaIngreso() != null && !empleado.getFechaIngreso().isBlank()) {
            try {
                java.time.LocalDate fechaIngreso = java.time.LocalDate.parse(empleado.getFechaIngreso().split("T")[0]);
                if (fechaIngreso.isAfter(java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")))) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La fecha de ingreso no puede ser futura."));
                }
            } catch (Exception e) {}
        }

        Empleado guardado = empleadoRepo.save(empleado);
        eventService.emitAsync("EMPLEADO_CREADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/empleados/{id}")
    public ResponseEntity<?> actualizarEmpleado(@PathVariable String id, @RequestBody Empleado empleado) {
        if (!empleadoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        Set<ConstraintViolation<Empleado>> violations = validator.validate(empleado);
        if (!violations.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", violations.iterator().next().getMessage()));
        }
        
        var existing = empleadoRepo.findByDocumento(empleado.getDocumento());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ya existe otro empleado con este documento."));
        }
        
        if (empleado.getFechaIngreso() != null && !empleado.getFechaIngreso().isBlank()) {
            try {
                java.time.LocalDate fechaIngreso = java.time.LocalDate.parse(empleado.getFechaIngreso().split("T")[0]);
                if (fechaIngreso.isAfter(java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")))) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La fecha de ingreso no puede ser futura."));
                }
            } catch (Exception e) {}
        }

        empleado.setId(id);
        Empleado guardado = empleadoRepo.save(empleado);
        eventService.emitAsync("EMPLEADO_ACTUALIZADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/empleados/{id}")
    @Transactional
    public ResponseEntity<?> eliminarEmpleado(@PathVariable String id) {
        if (!empleadoRepo.existsById(id)) return ResponseEntity.notFound().build();
        
        try {
            // Eliminar registros de producción usando JPA
            List<dev.kali.labendicion.domain.entity.Registro> registrosAsociados = registroRepo.findAll().stream()
                .filter(r -> id.equals(r.getEmpleadoId()))
                .collect(java.util.stream.Collectors.toList());
            if (!registrosAsociados.isEmpty()) {
                registroRepo.deleteAll(registrosAsociados);
            }

            // Eliminar entradas de aseo asociadas al empleado usando JPA
            List<dev.kali.labendicion.domain.entity.RegistroAseo> aseos = registroAseoRepo.findAll();
            for (dev.kali.labendicion.domain.entity.RegistroAseo aseo : aseos) {
                if (aseo.getEntries() != null) {
                    boolean removido = aseo.getEntries().removeIf(e -> id.equals(e.getEmpleadoId()));
                    if (removido) {
                        registroAseoRepo.save(aseo);
                    }
                }
            }

            // Borrado físico del empleado
            empleadoRepo.deleteById(id);
            eventService.emitAsync("EMPLEADO_ELIMINADO", Map.of("id", id));
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error eliminando empleado: " + e.getMessage());
        }
    }

    @PostMapping("/registros")
    @Transactional
    public ResponseEntity<?> crearRegistro(@RequestBody Registro registro) {
        if (registro.getId() == null) {
            registro.setId(generateId());
        }
        var error = registroValidation.validarProducciones(registro, null);
        if (error.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.get()));
        }
        recalcularTotales(registro);
        Registro guardado = registroRepo.save(registro);
        eventService.emitAsync("REGISTRO_CREADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/registros/{id}")
    @Transactional
    public ResponseEntity<?> actualizarRegistro(@PathVariable String id, @RequestBody Registro registro) {
        if (!registroRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        registro.setId(id);
        var error = registroValidation.validarProducciones(registro, id);
        if (error.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.get()));
        }
        recalcularTotales(registro);
        Registro guardado = registroRepo.save(registro);
        eventService.emitAsync("REGISTRO_ACTUALIZADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/registros/{id}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable String id) {
        registroRepo.deleteById(id);
        eventService.emitAsync("REGISTRO_ELIMINADO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tareas-aseo")
    public ResponseEntity<TareaAseo> crearTarea(@RequestBody TareaAseo tarea) {
        if (tarea.getId() == null) {
            tarea.setId(generateId());
        }
        TareaAseo guardada = tareaAseoRepo.save(tarea);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/tareas-aseo/{id}")
    public ResponseEntity<TareaAseo> actualizarTarea(@PathVariable String id, @RequestBody TareaAseo tarea) {
        if (!tareaAseoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tarea.setId(id);
        TareaAseo guardada = tareaAseoRepo.save(tarea);
        return ResponseEntity.ok(guardada);
    }

    @PatchMapping("/tareas-aseo/{id}/toggle")
    public ResponseEntity<TareaAseo> toggleTarea(@PathVariable String id) {
        return tareaAseoRepo.findById(id)
                .map(tarea -> {
                    tarea.setCompletada(!tarea.isCompletada());
                    TareaAseo guardada = tareaAseoRepo.save(tarea);
                    return ResponseEntity.ok(guardada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tareas-aseo/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable String id) {
        tareaAseoRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Registros de Aseo: nuevo modelo que agrupa por fecha y contiene entradas por empleado
    @GetMapping("/registros-aseo")
    public ResponseEntity<List<Map<String, Object>>> listarRegistrosAseo() {
        List<dev.kali.labendicion.domain.entity.RegistroAseo> regs = registroAseoRepo.findAllWithEntriesOrderByFechaDesc();
        List<Map<String, Object>> dto = regs.stream().map(this::mapRegistroAseoToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/registros-aseo/{id}")
    public ResponseEntity<?> obtenerRegistroAseo(@PathVariable String id) {
        return registroAseoRepo.findWithEntriesById(id)
                .map(r -> ResponseEntity.ok(mapRegistroAseoToDto(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/registros-aseo")
    @Transactional
    public ResponseEntity<?> crearRegistroAseo(@RequestBody(required = false) java.util.Map<String, Object> body) {
        try {
            String fecha = null;
            if (body != null && body.get("fecha") != null) fecha = body.get("fecha").toString();
            if (fecha == null || fecha.isBlank()) {
                fecha = java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")).toString();
            }

            var existente = registroAseoRepo.findByFecha(fecha);
            if (existente.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("mensaje", "Ya existe un registro de aseo para la fecha " + fecha,
                                "registro", mapRegistroAseoToDto(existente.get())));
            }

            dev.kali.labendicion.domain.entity.RegistroAseo ultimo = registroAseoRepo.findFirstByOrderByFechaDesc().orElse(null);
            String defaultAcciones = CsvListUtil.toCsv(accionAseoRepo.findAllByActivaTrueOrderByNombreAsc().stream()
                    .map(AccionAseo::getNombre).collect(Collectors.toList()));
            String defaultAreas = CsvListUtil.toCsv(areaTrabajoRepo.findAllByActivaTrueOrderByNombreAsc().stream()
                    .map(AreaTrabajo::getNombre).collect(Collectors.toList()));

            // Crear nuevo registro
            dev.kali.labendicion.domain.entity.RegistroAseo nuevo = new dev.kali.labendicion.domain.entity.RegistroAseo();
            nuevo.setId(generateId());
            nuevo.setFecha(fecha);

            List<dev.kali.labendicion.domain.entity.Empleado> empleados = empleadoRepo.findAll();
            for (dev.kali.labendicion.domain.entity.Empleado emp : empleados) {
                dev.kali.labendicion.domain.entity.RegistroAseoEntry entry = new dev.kali.labendicion.domain.entity.RegistroAseoEntry();
                entry.setId(generateId());
                entry.setRegistroAseo(nuevo);
                entry.setEmpleadoId(emp.getId());
                entry.setEmpleadoNombre(emp.getNombre());
                entry.setCompletada(false);

                // Prefill from ultimo registro for this empleado, o catálogo por defecto
                if (ultimo != null && ultimo.getEntries() != null) {
                    ultimo.getEntries().stream()
                            .filter(e -> emp.getId().equals(e.getEmpleadoId()))
                            .findFirst()
                            .ifPresent(prev -> {
                                entry.setAccionesCsv(prev.getAccionesCsv());
                                entry.setAreasCsv(prev.getAreasCsv());
                            });
                }
                if (entry.getAccionesCsv() == null || entry.getAccionesCsv().isBlank()) {
                    entry.setAccionesCsv(defaultAcciones);
                }
                if (entry.getAreasCsv() == null || entry.getAreasCsv().isBlank()) {
                    entry.setAreasCsv(defaultAreas);
                }

                nuevo.getEntries().add(entry);
            }

            RegistroAseo saved = registroAseoRepo.save(nuevo);
            eventService.emitAsync("REGISTRO_ASEO_CREADO", mapRegistroAseoToDto(saved));
            return ResponseEntity.ok(mapRegistroAseoToDto(saved));
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/registros-aseo");
        }
    }

    @PatchMapping("/registros-aseo/{registroId}/entries/{entryId}/toggle")
    @Transactional
    public ResponseEntity<?> toggleEntryCompletada(@PathVariable String registroId, @PathVariable String entryId) {
        try {
            dev.kali.labendicion.domain.entity.RegistroAseo reg = registroAseoRepo.findWithEntriesById(registroId)
                    .orElseThrow(() -> new java.util.NoSuchElementException("Registro no encontrado"));
            boolean changed = false;
            for (dev.kali.labendicion.domain.entity.RegistroAseoEntry e : reg.getEntries()) {
                if (e.getId().equals(entryId)) {
                    e.setCompletada(!e.isCompletada());
                    changed = true;
                    break;
                }
            }
                if (changed) {
                    RegistroAseo saved = registroAseoRepo.save(reg);
                    eventService.emitAsync("REGISTRO_ASEO_ENTRY_TOGGLE", mapRegistroAseoToDto(saved));
                    return ResponseEntity.ok(mapRegistroAseoToDto(saved));
                }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/registros-aseo/" + registroId + "/entries/" + entryId + "/toggle");
        }
    }

    @PatchMapping("/registros-aseo/{registroId}/entries/{entryId}")
    @Transactional
    public ResponseEntity<?> actualizarEntryAccionesYAreas(@PathVariable String registroId, @PathVariable String entryId,
                                                           @RequestBody java.util.Map<String, Object> body) {
        try {
            // Validar que haya al menos 1 acción y 1 área
            if (body.containsKey("acciones")) {
                Object accionesObj = body.get("acciones");
                if (accionesObj instanceof java.util.List && ((java.util.List<?>) accionesObj).isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Debes asignar al menos una acción de aseo al empleado."));
                }
            }
            if (body.containsKey("areas")) {
                Object areasObj = body.get("areas");
                if (areasObj instanceof java.util.List && ((java.util.List<?>) areasObj).isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Debes asignar al menos un área de trabajo al empleado."));
                }
            }

            dev.kali.labendicion.domain.entity.RegistroAseo reg = registroAseoRepo.findWithEntriesById(registroId)
                    .orElseThrow(() -> new java.util.NoSuchElementException("Registro no encontrado"));
            boolean changed = false;
            for (dev.kali.labendicion.domain.entity.RegistroAseoEntry e : reg.getEntries()) {
                if (e.getId().equals(entryId)) {
                    if (body.containsKey("acciones")) {
                        Object accionesObj = body.get("acciones");
                        if (accionesObj instanceof java.util.List) {
                            e.setAccionesCsv(CsvListUtil.toCsv(((java.util.List<?>) accionesObj)));
                            changed = true;
                        }
                    }
                    if (body.containsKey("areas")) {
                        Object areasObj = body.get("areas");
                        if (areasObj instanceof java.util.List) {
                            e.setAreasCsv(CsvListUtil.toCsv(((java.util.List<?>) areasObj)));
                            changed = true;
                        }
                    }
                    break;
                }
            }
            if (changed) {
                RegistroAseo saved = registroAseoRepo.save(reg);
                eventService.emitAsync("REGISTRO_ASEO_ENTRY_ACTUALIZADO", mapRegistroAseoToDto(saved));
                return ResponseEntity.ok(mapRegistroAseoToDto(saved));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/registros-aseo/" + registroId + "/entries/" + entryId);
        }
    }

    @DeleteMapping("/registros-aseo/{id}")
    @Transactional
    public ResponseEntity<Void> eliminarRegistroAseo(@PathVariable String id) {
        registroAseoRepo.deleteById(id);
        eventService.emitAsync("REGISTRO_ASEO_ELIMINADO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    // Pasos de Producción CRUD
    @GetMapping("/productos/{productoId}/pasos")
    public ResponseEntity<List<PasoProduccion>> listarPasos(@PathVariable String productoId) {
        return ResponseEntity.ok(pasoRepo.findByProductoId(productoId));
    }

    @PostMapping("/productos/{productoId}/pasos")
    @Transactional
    public ResponseEntity<?> crearPaso(@PathVariable String productoId, @RequestBody java.util.Map<String, Object> body) {
        try {
            Producto producto = productoRepo.findById(productoId).orElseThrow();
            PasoProduccion paso = new PasoProduccion();
            paso.setId(generateId());
            paso.setProducto(producto);
            aplicarDatosPaso(paso, body);
            PasoProduccion guardado = pasoRepo.save(paso);
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/productos/" + productoId + "/pasos");
        }
    }

    @PutMapping("/pasos/{pasoId}")
    @Transactional
    public ResponseEntity<?> actualizarPaso(@PathVariable String pasoId, @RequestBody java.util.Map<String, Object> body) {
        try {
            PasoProduccion paso = pasoRepo.findById(pasoId).orElseThrow();
            if (body.containsKey("descripcion")) paso.setDescripcion((String) body.get("descripcion"));
            if (body.containsKey("metaUnidadesHora")) paso.setMetaUnidadesHora(body.get("metaUnidadesHora") == null ? null : Integer.parseInt(body.get("metaUnidadesHora").toString()));
            if (body.containsKey("completado")) paso.setCompletado((Boolean) body.get("completado"));
            PasoProduccion guardado = pasoRepo.save(paso);
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/pasos/" + pasoId);
        }
    }

    @PatchMapping("/pasos/{pasoId}/toggle")
    @Transactional
    public ResponseEntity<?> togglePaso(@PathVariable String pasoId) {
        try {
            PasoProduccion paso = pasoRepo.findById(pasoId).orElseThrow();
            paso.setCompletado(!paso.getCompletado());
            PasoProduccion guardado = pasoRepo.save(paso);
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/pasos/" + pasoId + "/toggle");
        }
    }

    @DeleteMapping("/pasos/{pasoId}")
    public ResponseEntity<Void> eliminarPaso(@PathVariable String pasoId) {
        pasoRepo.deleteById(pasoId);
        return ResponseEntity.noContent().build();
    }

    // ========== FINANZAS ==========

    @GetMapping("/finanzas")
    public ResponseEntity<List<Map<String, Object>>> listarMovimientos() {
        List<Map<String, Object>> dto = movimientoFinancieroRepo.findAllByOrderByMesDescFechaDesc()
                .stream().map(this::mapMovimientoToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/finanzas/movimientos")
    @Transactional
    public ResponseEntity<?> crearMovimiento(@RequestBody java.util.Map<String, Object> body) {
        try {
            String mes = body.containsKey("mes") && body.get("mes") != null
                    ? body.get("mes").toString()
                    : java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")).toString().substring(0, 7);

            String nombre = body.containsKey("nombre") ? body.get("nombre").toString() : "";
            if (nombre.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "El nombre es obligatorio."));

            String montoStr = body.containsKey("monto") && body.get("monto") != null ? body.get("monto").toString() : null;
            if (montoStr == null || montoStr.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "El monto es obligatorio."));
            double monto = Double.parseDouble(montoStr);

            String tipo = body.containsKey("tipo") ? body.get("tipo").toString() : "GASTO";
            if (!tipo.equals("GASTO") && !tipo.equals("INGRESO")) tipo = "GASTO";

            Double porcentaje = null;
            if (body.containsKey("porcentaje") && body.get("porcentaje") != null && !body.get("porcentaje").toString().isBlank()) {
                porcentaje = Double.parseDouble(body.get("porcentaje").toString());
            }

            dev.kali.labendicion.domain.entity.MovimientoFinanciero mv = new dev.kali.labendicion.domain.entity.MovimientoFinanciero();
            mv.setId(generateId());
            mv.setMes(mes);
            mv.setNombre(nombre);
            mv.setDescripcion(body.containsKey("descripcion") ? (String) body.get("descripcion") : null);
            mv.setMonto(monto);
            mv.setPorcentaje(porcentaje);
            mv.setTipo(tipo);
            mv.setOrigen("MANUAL");
            mv.setFecha(java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")).toString());

            if (body.containsKey("evidenciaUrl") && body.get("evidenciaUrl") != null && !body.get("evidenciaUrl").toString().isBlank()) {
                mv.setEvidenciaUrl(body.get("evidenciaUrl").toString());
            }

            dev.kali.labendicion.domain.entity.MovimientoFinanciero guardado = movimientoFinancieroRepo.save(mv);
            eventService.emitAsync("MOVIMIENTO_CREADO", mapMovimientoToDto(guardado));
            return ResponseEntity.ok(mapMovimientoToDto(guardado));
        } catch (Exception e) {
            e.printStackTrace();
            return serverError(e, "/api/frontend/finanzas/movimientos");
        }
    }

    @PostMapping("/finanzas/nomina/{mes}")
    @Transactional
    public ResponseEntity<?> registrarNomina(@PathVariable String mes) {
        try {
            // Borrar nomina previa del mes para reemplazarla
            List<dev.kali.labendicion.domain.entity.MovimientoFinanciero> previos =
                    movimientoFinancieroRepo.findByMesOrderByFechaDesc(mes).stream()
                            .filter(m -> "NOMINA".equals(m.getOrigen()))
                            .collect(Collectors.toList());
            movimientoFinancieroRepo.deleteAll(previos);

            List<dev.kali.labendicion.domain.entity.Empleado> empleados = empleadoRepo.findAll();
            List<dev.kali.labendicion.domain.entity.Registro> registros = registroRepo.findAllWithProduccionesOrderByFechaDesc();
            List<dev.kali.labendicion.domain.entity.Producto> productos = productoRepo.findAllWithPasosOrderByNombre();

            String fechaHoy = java.time.LocalDate.now(java.time.ZoneId.of("America/Bogota")).toString();
            List<dev.kali.labendicion.domain.entity.MovimientoFinanciero> creados = new java.util.ArrayList<>();

            for (dev.kali.labendicion.domain.entity.Empleado emp : empleados) {
                // Filtrar registros de este empleado en este mes
                List<dev.kali.labendicion.domain.entity.Registro> regEmp = registros.stream()
                        .filter(r -> emp.getId().equals(r.getEmpleadoId())
                                && r.getFecha() != null && r.getFecha().startsWith(mes))
                        .collect(Collectors.toList());

                if (regEmp.isEmpty()) continue;

                double pagoHoras = 0.0;
                double pagoProduccion = 0.0;

                for (dev.kali.labendicion.domain.entity.Registro reg : regEmp) {
                    // Pago por horas
                    if (reg.getValorHora() != null && reg.getHoraEntrada() != null && reg.getHoraSalida() != null
                            && !"--:--".equals(reg.getHoraEntrada()) && !"--:--".equals(reg.getHoraSalida())) {
                        try {
                            String[] entrada = reg.getHoraEntrada().split(":");
                            String[] salida = reg.getHoraSalida().split(":");
                            double hEntrada = Integer.parseInt(entrada[0]) + Integer.parseInt(entrada[1]) / 60.0;
                            double hSalida = Integer.parseInt(salida[0]) + Integer.parseInt(salida[1]) / 60.0;
                            double horas = Math.max(0, hSalida - hEntrada);
                            pagoHoras += horas * reg.getValorHora();
                        } catch (Exception ignored) {}
                    }
                    // Pago por producción
                    if (reg.getProducciones() != null) {
                        for (dev.kali.labendicion.domain.entity.ProduccionRegistro pr : reg.getProducciones()) {
                            // Calcular directamente sin lambda anidado
                            for (dev.kali.labendicion.domain.entity.Producto prod : productos) {
                                if (!prod.getId().equals(pr.getProductoId())) continue;
                                if (prod.getPasos() == null) continue;
                                for (PasoProduccion ps : prod.getPasos()) {
                                    if (ps.getId().equals(pr.getPasoId()) && ps.getValorPorUnidad() != null) {
                                        int unidades = pr.getUnidadesTotales() == null ? 0 : pr.getUnidadesTotales();
                                        pagoProduccion += unidades * ps.getValorPorUnidad();
                                    }
                                }
                            }
                        }
                    }
                }

                double totalPago = pagoHoras + pagoProduccion;
                if (totalPago <= 0) continue;

                dev.kali.labendicion.domain.entity.MovimientoFinanciero mv = new dev.kali.labendicion.domain.entity.MovimientoFinanciero();
                mv.setId(generateId());
                mv.setMes(mes);
                mv.setNombre("Nómina: " + emp.getNombre());
                mv.setDescripcion(String.format("Horas: $%.0f | Producción: $%.0f", pagoHoras, pagoProduccion));
                mv.setMonto(totalPago);
                mv.setTipo("GASTO");
                mv.setOrigen("NOMINA");
                mv.setEmpleadoId(emp.getId());
                mv.setFecha(fechaHoy);
                creados.add(movimientoFinancieroRepo.save(mv));
            }

            List<Map<String, Object>> dto = creados.stream().map(this::mapMovimientoToDto).collect(Collectors.toList());
            eventService.emitAsync("NOMINA_REGISTRADA", Map.of("mes", mes, "movimientos", dto));
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/finanzas/nomina/" + mes);
        }
    }

    @DeleteMapping("/finanzas/movimientos/{id}")
    public ResponseEntity<Void> eliminarMovimiento(@PathVariable String id) {
        movimientoFinancieroRepo.deleteById(id);
        eventService.emitAsync("MOVIMIENTO_ELIMINADO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> mapMovimientoToDto(dev.kali.labendicion.domain.entity.MovimientoFinanciero mv) {
        var m = new java.util.HashMap<String, Object>();
        m.put("id", mv.getId());
        m.put("mes", mv.getMes());
        m.put("nombre", mv.getNombre());
        m.put("descripcion", mv.getDescripcion());
        m.put("monto", mv.getMonto());
        m.put("porcentaje", mv.getPorcentaje());
        m.put("tipo", mv.getTipo());
        m.put("origen", mv.getOrigen());
        m.put("empleadoId", mv.getEmpleadoId());
        m.put("fecha", mv.getFecha());
        if (mv.getEvidenciaUrl() != null) {
            m.put("evidenciaUrl", mv.getEvidenciaUrl());
        }
        return m;
    }

    private static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private void seedCatalogsIfEmpty() {
        if (accionProduccionRepo.count() == 0) {
            String[][] defaults = {{"Confeccionar", "1"}, {"Revisar calidad", "2"}, {"Empacar", "3"}};
            for (String[] d : defaults) {
                accionProduccionRepo.save(AccionProduccion.builder()
                        .id(generateId()).nombre(d[0]).orden(Integer.parseInt(d[1])).activa(true).build());
            }
        }
        if (cargoRepo.count() == 0) {
            for (String nombre : new String[]{"Costurera", "Cortador", "Empacador", "Supervisor"}) {
                cargoRepo.save(CargoEmpleado.builder().id(generateId()).nombre(nombre).activa(true).build());
            }
        }
        if (areaTrabajoRepo.count() == 0) {
            for (String nombre : new String[]{"Taller", "Almacén", "Oficina", "Baño"}) {
                areaTrabajoRepo.save(AreaTrabajo.builder().id(generateId()).nombre(nombre).activa(true).build());
            }
        }
        if (accionAseoRepo.count() == 0) {
            for (String nombre : new String[]{"Barrer", "Trapear", "Organizar", "Desechar"}) {
                accionAseoRepo.save(AccionAseo.builder().id(generateId()).nombre(nombre).activa(true).build());
            }
        }
    }

    private void aplicarDatosPaso(PasoProduccion paso, java.util.Map<String, Object> pasoMap) {
        if (pasoMap.containsKey("accionProduccionId") && pasoMap.get("accionProduccionId") != null) {
            String accionId = pasoMap.get("accionProduccionId").toString();
            paso.setAccionProduccionId(accionId);
            accionProduccionRepo.findById(accionId).ifPresent(a -> paso.setDescripcion(a.getNombre()));
        }
        if (pasoMap.containsKey("descripcion")) {
            paso.setDescripcion((String) pasoMap.getOrDefault("descripcion", paso.getDescripcion()));
        } else if (paso.getDescripcion() == null) {
            paso.setDescripcion("");
        }
        paso.setMetaUnidadesHora(pasoMap.get("metaUnidadesHora") == null ? null : Integer.parseInt(pasoMap.get("metaUnidadesHora").toString()));
        paso.setCompletado((Boolean) pasoMap.getOrDefault("completado", false));
        if (pasoMap.containsKey("valorPorUnidad") && pasoMap.get("valorPorUnidad") != null) {
            paso.setValorPorUnidad(Double.parseDouble(pasoMap.get("valorPorUnidad").toString()));
        } else if (pasoMap.containsKey("valorPorUnidad")) {
            paso.setValorPorUnidad(null);
        }
    }

    private void recalcularTotales(Registro registro) {
        if (registro.getProducciones() == null || registro.getProducciones().isEmpty()) {
            registro.setUnidadesTotales(0);
            registro.setUnidadesBuenas(0);
            return;
        }
        int total = registro.getProducciones().stream()
                .mapToInt(p -> p.getUnidadesTotales() == null ? 0 : p.getUnidadesTotales()).sum();
        int buenas = registro.getProducciones().stream()
                .mapToInt(p -> p.getUnidadesBuenas() == null ? 0 : p.getUnidadesBuenas()).sum();
        registro.setUnidadesTotales(total);
        registro.setUnidadesBuenas(buenas);
    }

    // Convierte una entidad Producto a un DTO plano (evita serializar objetos Hibernate con referencias recursivas)
    private Map<String, Object> mapProductoToDto(Producto p) {
        var pasosDto = (p.getPasos() == null) ? List.<Object>of() : p.getPasos().stream().map(ps -> {
            var m = new java.util.HashMap<String, Object>();
            m.put("id", ps.getId());
            m.put("accionProduccionId", ps.getAccionProduccionId());
            m.put("descripcion", ps.getDescripcion());
            m.put("metaUnidadesHora", ps.getMetaUnidadesHora());
            m.put("completado", ps.getCompletado());
            m.put("valorPorUnidad", ps.getValorPorUnidad());
            return m;
        }).collect(Collectors.toList());
        var map = new java.util.HashMap<String, Object>();
        map.put("id", p.getId());
        map.put("nombre", p.getNombre());
        map.put("cantidad", p.getCantidad());
        map.put("empresa", p.getEmpresa());
        map.put("ganancia", p.getGanancia());
        map.put("fechaAsignacion", p.getFechaAsignacion());
        map.put("fechaTerminacion", p.getFechaTerminacion());
        map.put("estado", p.getEstado());
        map.put("pasos", pasosDto);
        return map;
    }

    private ResponseEntity<Object> serverError(Exception e, String ruta) {
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("estado", 500);
        body.put("ruta", ruta);
        body.put("mensaje", e.getMessage());
        body.put("error", "Error interno del servidor");
        body.put("timestamp", OffsetDateTime.now().toString());
        return ResponseEntity.status(500).body(body);
    }

    // Convierte una entidad RegistroAseo a un DTO plano que el frontend espera
    private Map<String, Object> mapRegistroAseoToDto(dev.kali.labendicion.domain.entity.RegistroAseo r) {
        var dto = new java.util.HashMap<String, Object>();
        var entries = (r.getEntries() == null) ? List.<Object>of() : r.getEntries().stream().map(e -> {
            var me = new java.util.HashMap<String, Object>();
            me.put("id", e.getId());
            me.put("empleadoId", e.getEmpleadoId());
            me.put("empleadoNombre", e.getEmpleadoNombre());
            me.put("acciones", CsvListUtil.fromCsv(e.getAccionesCsv()));
            me.put("areas", CsvListUtil.fromCsv(e.getAreasCsv()));
            me.put("completada", e.isCompletada());
            return me;
        }).collect(Collectors.toList());
        dto.put("id", r.getId());
        dto.put("fecha", r.getFecha());
        dto.put("entries", entries);
        return dto;
    }

}
