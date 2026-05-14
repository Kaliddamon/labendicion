package dev.kali.labendicion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import dev.kali.labendicion.domain.entity.*;
import dev.kali.labendicion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FrontendSyncController {

    @Autowired
    private ProductoSyncRepository productoRepo;

    @Autowired
    private EmpleadoSyncRepository empleadoRepo;

    @Autowired
    private RegistroSyncRepository registroRepo;

    @Autowired
    private TareaAseoSyncRepository tareaAseoRepo;

    @GetMapping("/bootstrap")
    public ResponseEntity<BootstrapResponse> bootstrap() {
        List<ProductoSync> productos = productoRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getNombre().compareTo(b.getNombre()))
                .collect(Collectors.toList());

        List<EmpleadoSync> empleados = empleadoRepo.findAll()
                .stream()
                .sorted((a, b) -> a.getNombre().compareTo(b.getNombre()))
                .collect(Collectors.toList());

        List<RegistroSync> registros = registroRepo.findByOrderByFechaDesc();

        List<TareaAseoSync> tareasAseo = tareaAseoRepo.findByOrderByCompletada();

        return ResponseEntity.ok(new BootstrapResponse(productos, empleados, registros, tareasAseo));
    }

    @PostMapping("/productos")
    public ResponseEntity<ProductoSync> crearProducto(@RequestBody ProductoSync producto) {
        if (producto.getId() == null) {
            producto.setId(generateId());
        }
        ProductoSync guardado = productoRepo.save(producto);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<ProductoSync> actualizarProducto(@PathVariable String id, @RequestBody ProductoSync producto) {
        if (!productoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        producto.setId(id);
        ProductoSync guardado = productoRepo.save(producto);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable String id) {
        productoRepo.deleteById(id);
        registroRepo.deleteAll(registroRepo.findAll().stream()
                .filter(r -> r.getProducciones() != null && r.getProducciones()
                        .stream().anyMatch(p -> id.equals(p.getProductoId())))
                .collect(Collectors.toList()));
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

    private static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public record BootstrapResponse(
            List<ProductoSync> productos,
            List<EmpleadoSync> empleados,
            List<RegistroSync> registros,
            List<TareaAseoSync> tareasAseo
    ) {}
}
