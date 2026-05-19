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
import org.springframework.beans.factory.annotation.Autowired;
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
    private EmpresaSyncRepository empresaRepo;

    @Autowired
    private PasoProduccionSyncRepository pasoRepo;

    @GetMapping("/bootstrap")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<Object> bootstrap() {
        // Cargar productos con pasos en una sola consulta para evitar lazy init
        List<ProductoSync> productos = productoRepo.findAllWithPasosOrderByNombre();

        List<EmpresaSync> empresas = empresaRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getRazonSocial().compareTo(b.getRazonSocial()))
                .collect(Collectors.toList());

        List<EmpleadoSync> empleados = empleadoRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getNombre().compareTo(b.getNombre()))
                .collect(Collectors.toList());

        // Cargar registros con producciones usando fetch join
        List<RegistroSync> registros = registroRepo.findAllWithProduccionesOrderByFechaDesc();

        List<TareaAseoSync> tareasAseo = tareaAseoRepo.findByOrderByCompletada();

        // Transformar a DTOs planos mientras la sesión está abierta para evitar LazyInitializationException
        var productosDto = productos.stream().map(p -> {
            var pasosDto = p.getPasos() == null ? List.<Object>of() : p.getPasos().stream().map(ps -> {
                var map = new java.util.HashMap<String, Object>();
                map.put("id", ps.getId());
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

        var tareasDto = tareasAseo.stream().map(t -> {
            var m = new java.util.HashMap<String, Object>();
            m.put("id", t.getId()); m.put("accion", t.getAccion()); m.put("area", t.getArea()); m.put("encargado", t.getEncargado()); m.put("completada", t.isCompletada());
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
        response.put("tareasAseo", tareasDto);
        response.put("empresas", empresasDto);

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
                        nuevoPaso.setDescripcion((String) pasoMap.getOrDefault("descripcion", ""));
                        nuevoPaso.setOrden(pasoMap.get("orden") == null ? 0 : Integer.parseInt(pasoMap.get("orden").toString()));
                        nuevoPaso.setCompletado((Boolean) pasoMap.getOrDefault("completado", false));
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

            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            e.printStackTrace();
            try { TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); } catch (Exception ignore) {}
            return serverError(e, "/api/frontend/productos");
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

            // Eliminar pasos previos si existen
            if (actual.getPasos() != null) {
                pasoRepo.deleteAll(actual.getPasos());
            }

            ProductoSync guardado = productoRepo.save(actual);

            // Procesar nuevos pasos
            Object pasosObj = body.get("pasos");
            if (pasosObj != null && pasosObj instanceof java.util.List) {
                java.util.List<?> pasosList = (java.util.List<?>) pasosObj;
                for (Object paso : pasosList) {
                    if (paso instanceof java.util.Map) {
                        java.util.Map<String, Object> pasoMap = (java.util.Map<String, Object>) paso;
                        PasoProduccionSync nuevoPaso = new PasoProduccionSync();
                        nuevoPaso.setId(generateId());
                        nuevoPaso.setProductoSync(guardado);
                        nuevoPaso.setDescripcion((String) pasoMap.getOrDefault("descripcion", ""));
                        nuevoPaso.setOrden(pasoMap.get("orden") == null ? 0 : Integer.parseInt(pasoMap.get("orden").toString()));
                        nuevoPaso.setCompletado((Boolean) pasoMap.getOrDefault("completado", false));
                        pasoRepo.save(nuevoPaso);
                    }
                }
                // Recargar producto con pasos actualizados
                guardado = productoRepo.findById(guardado.getId()).orElse(guardado);
            }

            // Actualizar estado de empresa asociada (si se cambió empresa)
            if (actual.getEmpresa() != null && !actual.getEmpresa().isBlank()) {
                List<EmpresaSync> matches = empresaRepo.findByRazonSocial(actual.getEmpresa());
                for (EmpresaSync emp : matches) {
                    emp.setEstado("Ordenes pendientes");
                    empresaRepo.save(emp);
                }
            }

            return ResponseEntity.ok(guardado);
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
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/empresas/{id}")
    public ResponseEntity<EmpresaSync> actualizarEmpresa(@PathVariable String id, @RequestBody EmpresaSync empresa) {
        if (!empresaRepo.existsById(id)) return ResponseEntity.notFound().build();
        empresa.setId(id);
        EmpresaSync saved = empresaRepo.save(empresa);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/empresas/{id}")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable String id) {
        empresaRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/empleados")
    public ResponseEntity<EmpleadoSync> crearEmpleado(@RequestBody EmpleadoSync empleado) {
        if (empleado.getId() == null) {
            empleado.setId(generateId());
        }
        EmpleadoSync guardado = empleadoRepo.save(empleado);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/empleados/{id}")
    public ResponseEntity<EmpleadoSync> actualizarEmpleado(@PathVariable String id, @RequestBody EmpleadoSync empleado) {
        if (!empleadoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        empleado.setId(id);
        EmpleadoSync guardado = empleadoRepo.save(empleado);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/empleados/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable String id) {
        empleadoRepo.deleteById(id);
        registroRepo.deleteAll(registroRepo.findAll().stream()
                .filter(r -> id.equals(r.getEmpleadoId()))
                .collect(Collectors.toList()));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registros")
    public ResponseEntity<RegistroSync> crearRegistro(@RequestBody RegistroSync registro) {
        if (registro.getId() == null) {
            registro.setId(generateId());
        }
        RegistroSync guardado = registroRepo.save(registro);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/registros/{id}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable String id) {
        registroRepo.deleteById(id);
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
            paso.setDescripcion((String) body.getOrDefault("descripcion", ""));
            paso.setOrden(body.get("orden") == null ? 0 : Integer.parseInt(body.get("orden").toString()));
            paso.setCompletado((Boolean) body.getOrDefault("completado", false));
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

    private ResponseEntity<Object> serverError(Exception e, String ruta) {
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("estado", 500);
        body.put("ruta", ruta);
        body.put("mensaje", e.getMessage());
        body.put("error", "Error interno del servidor");
        body.put("timestamp", OffsetDateTime.now().toString());
        return ResponseEntity.status(500).body(body);
    }

    public record BootstrapResponse(
            List<ProductoSync> productos,
            List<EmpleadoSync> empleados,
            List<RegistroSync> registros,
            List<TareaAseoSync> tareasAseo,
            List<EmpresaSync> empresas
    ) {}
}
