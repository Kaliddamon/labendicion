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
import java.util.concurrent.ConcurrentHashMap;
import java.time.OffsetDateTime;

import dev.kali.labendicion.domain.entity.*;
import dev.kali.labendicion.repository.*;
import dev.kali.labendicion.service.EventService;
import dev.kali.labendicion.service.RegistroSyncValidationService;
import dev.kali.labendicion.util.CsvListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/frontend")
public class FrontendSyncController {

    @Autowired
    private ProductoSyncRepository productoRepo;

    @Autowired
    private EmpleadoSyncRepository empleadoRepo;

    @Autowired
    private RegistroSyncRepository registroRepo;

    @Autowired
    private TareaAseoSyncRepository tareaAseoRepo;

    @Autowired
    private RegistroAseoSyncRepository registroAseoRepo;

    @Autowired
    private EmpresaSyncRepository empresaRepo;

    @Autowired
    private PasoProduccionSyncRepository pasoRepo;

    @Autowired
    private EventService eventService;

    @Autowired
    private AccionProduccionSyncRepository accionProduccionRepo;

    @Autowired
    private CargoEmpleadoSyncRepository cargoRepo;

    @Autowired
    private AreaTrabajoSyncRepository areaTrabajoSyncRepo;

    @Autowired
    private AccionAseoSyncRepository accionAseoRepo;

    @Autowired
    private RegistroSyncValidationService registroValidation;

    @GetMapping("/bootstrap")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<Object> bootstrap() {
        seedCatalogsIfEmpty();

        // Cargar productos con pasos en una sola consulta para evitar lazy init
        List<ProductoSync> productos = productoRepo.findAllWithPasosOrderByNombre();

        // Empresas: cargar todas (normalmente son pocas)
        List<EmpresaSync> empresas = empresaRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getRazonSocial().compareTo(b.getRazonSocial()))
                .collect(Collectors.toList());

        // Empleados: cargar todos (normalmente son <= 100)
        List<EmpleadoSync> empleados = empleadoRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getNombre().compareTo(b.getNombre()))
                .collect(Collectors.toList());

        // Registros: cargar últimos 100 para evitar queries gigantescas
        // En Render/Supabase si tienes miles de registros, esto es crucial
        List<RegistroSync> registros = registroRepo.findAllWithProduccionesOrderByFechaDesc();
        if (registros.size() > 100) {
            registros = registros.stream().limit(100).collect(Collectors.toList());
        }

        // Registros de aseo: cargar con entries (evita lazy init en serialización)
        List<dev.kali.labendicion.domain.entity.RegistroAseoSync> registrosAseo = registroAseoRepo.findAllWithEntriesOrderByFechaDesc();
        // Opcionalmente, si tienes miles de tareas, cargar solo las últimas 50:
        // if (tareasAseo.size() > 50) { tareasAseo = tareasAseo.stream().limit(50).collect(Collectors.toList()); }

        // Transformar a DTOs planos mientras la sesión está abierta para evitar LazyInitializationException
        var productosDto = productos.stream().map(p -> {
            var pasosDto = p.getPasos() == null ? List.<Object>of() : p.getPasos().stream().map(ps -> {
                var map = new java.util.HashMap<String, Object>();
                map.put("id", ps.getId());
                map.put("accionProduccionId", ps.getAccionProduccionId());
                map.put("descripcion", ps.getDescripcion());
                map.put("orden", ps.getOrden());
                map.put("completado", ps.getCompletado());
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
            m2.put("producciones", prodDto);
            return m2;
        }).collect(Collectors.toList());

        // Empleados, tareas y empresas: serializables simples
        var empleadosDto = empleados.stream().map(e -> {
            var m = new java.util.HashMap<String, Object>();
            m.put("id", e.getId()); m.put("nombre", e.getNombre()); m.put("cargo", e.getCargo()); m.put("documento", e.getDocumento()); m.put("telefono", e.getTelefono()); m.put("fechaIngreso", e.getFechaIngreso()); m.put("estado", e.getEstado());
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

        var response = new java.util.HashMap<String, Object>();
        response.put("productos", productosDto);
        response.put("empleados", empleadosDto);
        response.put("registros", registrosDto);
        // Antes se devolvía 'tareasAseo' (nombre histórico). El frontend espera 'registrosAseo'.
        response.put("registrosAseo", tareasDto);
        response.put("empresas", empresasDto);
        response.put("accionesProduccion", accionProduccionRepo.findAllByOrderByOrdenAscNombreAsc());
        response.put("cargos", cargoRepo.findAllByOrderByNombreAsc());
        response.put("areasTrabajo", areaTrabajoSyncRepo.findAllByOrderByNombreAsc());
        response.put("accionesAseo", accionAseoRepo.findAllByOrderByNombreAsc());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/productos")
    @Transactional
    public ResponseEntity<?> crearProducto(@RequestBody java.util.Map<String, Object> body) {
        try {
            ProductoSync producto = new ProductoSync();
            producto.setId(body.getOrDefault("id", generateId()).toString());
            producto.setNombre((String) body.getOrDefault("nombre", ""));
            producto.setCantidad(body.get("cantidad") == null ? null : Integer.parseInt(body.get("cantidad").toString()));
            producto.setEmpresa((String) body.getOrDefault("empresa", ""));
            producto.setGanancia(body.get("ganancia") == null ? null : Integer.parseInt(body.get("ganancia").toString()));
            producto.setFechaAsignacion((String) body.getOrDefault("fechaAsignacion", ""));
            producto.setFechaTerminacion((String) body.getOrDefault("fechaTerminacion", ""));
            producto.setEstado((String) body.getOrDefault("estado", "Pendiente"));

            ProductoSync guardado = productoRepo.save(producto);

            // Procesar pasos como entidades relacionales
            Object pasosObj = body.get("pasos");
            if (pasosObj != null && pasosObj instanceof java.util.List) {
                java.util.List<?> pasosList = (java.util.List<?>) pasosObj;
                for (Object paso : pasosList) {
                    if (paso instanceof java.util.Map) {
                        java.util.Map<String, Object> pasoMap = (java.util.Map<String, Object>) paso;
                        PasoProduccionSync nuevoPaso = new PasoProduccionSync();
                        nuevoPaso.setId(generateId());
                        nuevoPaso.setProductoSync(guardado);
                        aplicarDatosPaso(nuevoPaso, pasoMap);
                        pasoRepo.save(nuevoPaso);
                    }
                }
                // Recargar producto con pasos
                guardado = productoRepo.findById(guardado.getId()).orElse(guardado);
            }

            // Actualizar estado de empresa asociada si existe
            if (producto.getEmpresa() != null && !producto.getEmpresa().isBlank()) {
                List<EmpresaSync> matches = empresaRepo.findByRazonSocial(producto.getEmpresa());
                for (EmpresaSync emp : matches) {
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
            ProductoSync actual = productoRepo.findById(id).orElseThrow();
            if (body.containsKey("estado")) {
                actual.setEstado(body.get("estado").toString());
            }
            ProductoSync guardado = productoRepo.save(actual);
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
            ProductoSync actual = productoRepo.findById(id).orElseThrow();
            actual.setNombre((String) body.getOrDefault("nombre", actual.getNombre()));
            if (body.containsKey("cantidad")) actual.setCantidad(body.get("cantidad") == null ? null : Integer.parseInt(body.get("cantidad").toString()));
            if (body.containsKey("empresa")) actual.setEmpresa((String) body.get("empresa"));
            if (body.containsKey("ganancia")) actual.setGanancia(body.get("ganancia") == null ? null : Integer.parseInt(body.get("ganancia").toString()));
            actual.setFechaAsignacion((String) body.getOrDefault("fechaAsignacion", actual.getFechaAsignacion()));
            actual.setFechaTerminacion((String) body.getOrDefault("fechaTerminacion", actual.getFechaTerminacion()));
            actual.setEstado((String) body.getOrDefault("estado", actual.getEstado()));

            // Eliminar pasos previos: solo limpiar la lista en-memory.
            // Con orphanRemoval=true en ProductoSync, Hibernate eliminará automáticamente
            // los pasos que se remuevan de la lista al hacer save().
            if (actual.getPasos() != null) {
                actual.getPasos().clear();
            }

            // Procesar nuevos pasos desde el request y agregarlos a la lista
            Object pasosObj = body.get("pasos");
            if (pasosObj != null && pasosObj instanceof java.util.List) {
                java.util.List<?> pasosList = (java.util.List<?>) pasosObj;
                for (Object paso : pasosList) {
                    if (paso instanceof java.util.Map) {
                        java.util.Map<String, Object> pasoMap = (java.util.Map<String, Object>) paso;
                        PasoProduccionSync nuevoPaso = new PasoProduccionSync();
                        nuevoPaso.setId(generateId());
                        nuevoPaso.setProductoSync(actual);
                        aplicarDatosPaso(nuevoPaso, pasoMap);
                        actual.getPasos().add(nuevoPaso);
                    }
                }
            }

            // Guardar una sola vez: Hibernate manejará la cascada y eliminará/insertará pasos automaticamente
            ProductoSync guardado = productoRepo.save(actual);

            // Actualizar estado de empresa asociada (si se cambió empresa)
            if (actual.getEmpresa() != null && !actual.getEmpresa().isBlank()) {
                List<EmpresaSync> matches = empresaRepo.findByRazonSocial(actual.getEmpresa());
                for (EmpresaSync emp : matches) {
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
        try {
            productoRepo.deleteById(id);
            registroRepo.deleteAll(registroRepo.findAll().stream()
                    .filter(r -> r.getProducciones() != null && r.getProducciones()
                            .stream().anyMatch(p -> id.equals(p.getProductoId())))
                    .collect(Collectors.toList()));
            // Actualizar estado de empresa asociada si ya no tiene órdenes
            List<EmpresaSync> todas = empresaRepo.findAll();
            for (EmpresaSync emp : todas) {
                boolean tiene = productoRepo.findAll().stream().anyMatch(p -> emp.getRazonSocial().equals(p.getEmpresa()));
                if (!tiene) {
                    emp.setEstado("Sin ordenes");
                    empresaRepo.save(emp);
                }
            }
            eventService.emitAsync("PRODUCTO_ELIMINADO", Map.of("id", id));
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/productos/" + id);
        }
    }

    // Empresas CRUD
    @GetMapping("/empresas")
    public ResponseEntity<List<EmpresaSync>> listarEmpresas() {
        return ResponseEntity.ok(empresaRepo.findAll());
    }

    @PostMapping("/empresas")
    public ResponseEntity<EmpresaSync> crearEmpresa(@RequestBody EmpresaSync empresa) {
        if (empresa.getId() == null) empresa.setId(generateId());
        EmpresaSync saved = empresaRepo.save(empresa);
        eventService.emitAsync("EMPRESA_CREADA", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/empresas/{id}")
    public ResponseEntity<EmpresaSync> actualizarEmpresa(@PathVariable String id, @RequestBody EmpresaSync empresa) {
        if (!empresaRepo.existsById(id)) return ResponseEntity.notFound().build();
        empresa.setId(id);
        EmpresaSync saved = empresaRepo.save(empresa);
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
    public ResponseEntity<EmpleadoSync> crearEmpleado(@RequestBody EmpleadoSync empleado) {
        if (empleado.getId() == null) {
            empleado.setId(generateId());
        }
        EmpleadoSync guardado = empleadoRepo.save(empleado);
        eventService.emitAsync("EMPLEADO_CREADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/empleados/{id}")
    public ResponseEntity<EmpleadoSync> actualizarEmpleado(@PathVariable String id, @RequestBody EmpleadoSync empleado) {
        if (!empleadoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        empleado.setId(id);
        EmpleadoSync guardado = empleadoRepo.save(empleado);
        eventService.emitAsync("EMPLEADO_ACTUALIZADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/empleados/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable String id) {
        empleadoRepo.deleteById(id);
        registroRepo.deleteAll(registroRepo.findAll().stream()
                .filter(r -> id.equals(r.getEmpleadoId()))
                .collect(Collectors.toList()));
        eventService.emitAsync("EMPLEADO_ELIMINADO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registros")
    @Transactional
    public ResponseEntity<?> crearRegistro(@RequestBody RegistroSync registro) {
        if (registro.getId() == null) {
            registro.setId(generateId());
        }
        var error = registroValidation.validarProducciones(registro, null);
        if (error.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.get()));
        }
        recalcularTotales(registro);
        RegistroSync guardado = registroRepo.save(registro);
        eventService.emitAsync("REGISTRO_CREADO", guardado);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/registros/{id}")
    @Transactional
    public ResponseEntity<?> actualizarRegistro(@PathVariable String id, @RequestBody RegistroSync registro) {
        if (!registroRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        registro.setId(id);
        var error = registroValidation.validarProducciones(registro, id);
        if (error.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.get()));
        }
        recalcularTotales(registro);
        RegistroSync guardado = registroRepo.save(registro);
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
    public ResponseEntity<TareaAseoSync> crearTarea(@RequestBody TareaAseoSync tarea) {
        if (tarea.getId() == null) {
            tarea.setId(generateId());
        }
        TareaAseoSync guardada = tareaAseoRepo.save(tarea);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/tareas-aseo/{id}")
    public ResponseEntity<TareaAseoSync> actualizarTarea(@PathVariable String id, @RequestBody TareaAseoSync tarea) {
        if (!tareaAseoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tarea.setId(id);
        TareaAseoSync guardada = tareaAseoRepo.save(tarea);
        return ResponseEntity.ok(guardada);
    }

    @PatchMapping("/tareas-aseo/{id}/toggle")
    public ResponseEntity<TareaAseoSync> toggleTarea(@PathVariable String id) {
        return tareaAseoRepo.findById(id)
                .map(tarea -> {
                    tarea.setCompletada(!tarea.isCompletada());
                    TareaAseoSync guardada = tareaAseoRepo.save(tarea);
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
        List<dev.kali.labendicion.domain.entity.RegistroAseoSync> regs = registroAseoRepo.findAllWithEntriesOrderByFechaDesc();
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
                fecha = java.time.LocalDate.now().toString();
            }

            var existente = registroAseoRepo.findByFecha(fecha);
            if (existente.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("mensaje", "Ya existe un registro de aseo para la fecha " + fecha,
                                "registro", mapRegistroAseoToDto(existente.get())));
            }

            dev.kali.labendicion.domain.entity.RegistroAseoSync ultimo = registroAseoRepo.findFirstByOrderByFechaDesc().orElse(null);
            String defaultAcciones = CsvListUtil.toCsv(accionAseoRepo.findAllByActivaTrueOrderByNombreAsc().stream()
                    .map(AccionAseoSync::getNombre).collect(Collectors.toList()));
            String defaultAreas = CsvListUtil.toCsv(areaTrabajoSyncRepo.findAllByActivaTrueOrderByNombreAsc().stream()
                    .map(AreaTrabajoSync::getNombre).collect(Collectors.toList()));

            // Crear nuevo registro
            dev.kali.labendicion.domain.entity.RegistroAseoSync nuevo = new dev.kali.labendicion.domain.entity.RegistroAseoSync();
            nuevo.setId(generateId());
            nuevo.setFecha(fecha);

            List<dev.kali.labendicion.domain.entity.EmpleadoSync> empleados = empleadoRepo.findAll();
            for (dev.kali.labendicion.domain.entity.EmpleadoSync emp : empleados) {
                dev.kali.labendicion.domain.entity.RegistroAseoEntrySync entry = new dev.kali.labendicion.domain.entity.RegistroAseoEntrySync();
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

            RegistroAseoSync saved = registroAseoRepo.save(nuevo);
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
            dev.kali.labendicion.domain.entity.RegistroAseoSync reg = registroAseoRepo.findWithEntriesById(registroId)
                    .orElseThrow(() -> new java.util.NoSuchElementException("Registro no encontrado"));
            boolean changed = false;
            for (dev.kali.labendicion.domain.entity.RegistroAseoEntrySync e : reg.getEntries()) {
                if (e.getId().equals(entryId)) {
                    e.setCompletada(!e.isCompletada());
                    changed = true;
                    break;
                }
            }
                if (changed) {
                    RegistroAseoSync saved = registroAseoRepo.save(reg);
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
            dev.kali.labendicion.domain.entity.RegistroAseoSync reg = registroAseoRepo.findWithEntriesById(registroId)
                    .orElseThrow(() -> new java.util.NoSuchElementException("Registro no encontrado"));
            boolean changed = false;
            for (dev.kali.labendicion.domain.entity.RegistroAseoEntrySync e : reg.getEntries()) {
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
                RegistroAseoSync saved = registroAseoRepo.save(reg);
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
    public ResponseEntity<List<PasoProduccionSync>> listarPasos(@PathVariable String productoId) {
        return ResponseEntity.ok(pasoRepo.findByProductoSyncId(productoId));
    }

    @PostMapping("/productos/{productoId}/pasos")
    @Transactional
    public ResponseEntity<?> crearPaso(@PathVariable String productoId, @RequestBody java.util.Map<String, Object> body) {
        try {
            ProductoSync producto = productoRepo.findById(productoId).orElseThrow();
            PasoProduccionSync paso = new PasoProduccionSync();
            paso.setId(generateId());
            paso.setProductoSync(producto);
            aplicarDatosPaso(paso, body);
            PasoProduccionSync guardado = pasoRepo.save(paso);
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
            PasoProduccionSync paso = pasoRepo.findById(pasoId).orElseThrow();
            if (body.containsKey("descripcion")) paso.setDescripcion((String) body.get("descripcion"));
            if (body.containsKey("orden")) paso.setOrden(Integer.parseInt(body.get("orden").toString()));
            if (body.containsKey("completado")) paso.setCompletado((Boolean) body.get("completado"));
            PasoProduccionSync guardado = pasoRepo.save(paso);
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
            PasoProduccionSync paso = pasoRepo.findById(pasoId).orElseThrow();
            paso.setCompletado(!paso.getCompletado());
            PasoProduccionSync guardado = pasoRepo.save(paso);
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

    private static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private void seedCatalogsIfEmpty() {
        if (accionProduccionRepo.count() == 0) {
            String[][] defaults = {{"Confeccionar", "1"}, {"Revisar calidad", "2"}, {"Empacar", "3"}};
            for (String[] d : defaults) {
                accionProduccionRepo.save(AccionProduccionSync.builder()
                        .id(generateId()).nombre(d[0]).orden(Integer.parseInt(d[1])).activa(true).build());
            }
        }
        if (cargoRepo.count() == 0) {
            for (String nombre : new String[]{"Costurera", "Cortador", "Empacador", "Supervisor"}) {
                cargoRepo.save(CargoEmpleadoSync.builder().id(generateId()).nombre(nombre).activa(true).build());
            }
        }
        if (areaTrabajoSyncRepo.count() == 0) {
            for (String nombre : new String[]{"Taller", "Almacén", "Oficina", "Baño"}) {
                areaTrabajoSyncRepo.save(AreaTrabajoSync.builder().id(generateId()).nombre(nombre).activa(true).build());
            }
        }
        if (accionAseoRepo.count() == 0) {
            for (String nombre : new String[]{"Barrer", "Trapear", "Organizar", "Desechar"}) {
                accionAseoRepo.save(AccionAseoSync.builder().id(generateId()).nombre(nombre).activa(true).build());
            }
        }
    }

    private void aplicarDatosPaso(PasoProduccionSync paso, java.util.Map<String, Object> pasoMap) {
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
        paso.setOrden(pasoMap.get("orden") == null ? 0 : Integer.parseInt(pasoMap.get("orden").toString()));
        paso.setCompletado((Boolean) pasoMap.getOrDefault("completado", false));
    }

    private void recalcularTotales(RegistroSync registro) {
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

    // Convierte una entidad ProductoSync a un DTO plano (evita serializar objetos Hibernate con referencias recursivas)
    private Map<String, Object> mapProductoToDto(ProductoSync p) {
        var pasosDto = (p.getPasos() == null) ? List.<Object>of() : p.getPasos().stream().map(ps -> {
            var m = new java.util.HashMap<String, Object>();
            m.put("id", ps.getId());
            m.put("accionProduccionId", ps.getAccionProduccionId());
            m.put("descripcion", ps.getDescripcion());
            m.put("orden", ps.getOrden());
            m.put("completado", ps.getCompletado());
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

    // Convierte una entidad RegistroAseoSync a un DTO plano que el frontend espera
    private Map<String, Object> mapRegistroAseoToDto(dev.kali.labendicion.domain.entity.RegistroAseoSync r) {
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
