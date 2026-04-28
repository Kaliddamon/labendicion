package dev.kali.labendicion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/frontend")
public class FrontendSyncController {

    private final Map<String, ProductoPayload> productos = new ConcurrentHashMap<>();
    private final Map<String, EmpleadoPayload> empleados = new ConcurrentHashMap<>();
    private final Map<String, RegistroPayload> registros = new ConcurrentHashMap<>();
    private final Map<String, TareaAseoPayload> tareasAseo = new ConcurrentHashMap<>();

    @GetMapping("/bootstrap")
    public ResponseEntity<BootstrapResponse> bootstrap() {
        return ResponseEntity.ok(new BootstrapResponse(
            sortProductosByNombre(productos.values().stream().toList()),
            sortEmpleadosByNombre(empleados.values().stream().toList()),
            sortByFechaDesc(registros.values().stream().toList()),
            sortByCompletada(tareasAseo.values().stream().toList())
        ));
    }

    @PostMapping("/productos")
    public ResponseEntity<ProductoPayload> crearProducto(@RequestBody ProductoPayload payload) {
        String id = generateId();
        ProductoPayload nuevo = payload.withId(id);
        productos.put(id, nuevo);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<ProductoPayload> actualizarProducto(@PathVariable String id, @RequestBody ProductoPayload payload) {
        if (!productos.containsKey(id)) return ResponseEntity.notFound().build();
        ProductoPayload actualizado = payload.withId(id);
        productos.put(id, actualizado);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable String id) {
        productos.remove(id);
        registros.values().forEach(reg -> {
            if (reg.producciones != null) {
                reg.producciones.removeIf(p -> id.equals(p.productoId));
            }
        });
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/empleados")
    public ResponseEntity<EmpleadoPayload> crearEmpleado(@RequestBody EmpleadoPayload payload) {
        String id = generateId();
        EmpleadoPayload nuevo = payload.withId(id);
        empleados.put(id, nuevo);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/empleados/{id}")
    public ResponseEntity<EmpleadoPayload> actualizarEmpleado(@PathVariable String id, @RequestBody EmpleadoPayload payload) {
        if (!empleados.containsKey(id)) return ResponseEntity.notFound().build();
        EmpleadoPayload actualizado = payload.withId(id);
        empleados.put(id, actualizado);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/empleados/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable String id) {
        empleados.remove(id);
        registros.entrySet().removeIf(entry -> id.equals(entry.getValue().empleadoId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registros")
    public ResponseEntity<RegistroPayload> crearRegistro(@RequestBody RegistroPayload payload) {
        String id = generateId();
        RegistroPayload nuevo = payload.withId(id);
        registros.put(id, nuevo);
        return ResponseEntity.ok(nuevo);
    }

    @DeleteMapping("/registros/{id}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable String id) {
        registros.remove(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tareas-aseo")
    public ResponseEntity<TareaAseoPayload> crearTarea(@RequestBody TareaAseoPayload payload) {
        String id = generateId();
        TareaAseoPayload nueva = payload.withId(id);
        tareasAseo.put(id, nueva);
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/tareas-aseo/{id}")
    public ResponseEntity<TareaAseoPayload> actualizarTarea(@PathVariable String id, @RequestBody TareaAseoPayload payload) {
        if (!tareasAseo.containsKey(id)) return ResponseEntity.notFound().build();
        TareaAseoPayload actualizada = payload.withId(id);
        tareasAseo.put(id, actualizada);
        return ResponseEntity.ok(actualizada);
    }

    @PatchMapping("/tareas-aseo/{id}/toggle")
    public ResponseEntity<TareaAseoPayload> toggleTarea(@PathVariable String id) {
        TareaAseoPayload actual = tareasAseo.get(id);
        if (actual == null) return ResponseEntity.notFound().build();
        TareaAseoPayload toggled = new TareaAseoPayload(actual.id, actual.accion, actual.area, actual.encargado, !actual.completada);
        tareasAseo.put(id, toggled);
        return ResponseEntity.ok(toggled);
    }

    @DeleteMapping("/tareas-aseo/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable String id) {
        tareasAseo.remove(id);
        return ResponseEntity.noContent().build();
    }

    private static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private static List<ProductoPayload> sortProductosByNombre(List<ProductoPayload> data) {
        List<ProductoPayload> list = new ArrayList<>(data);
        list.sort(Comparator.comparing(a -> safe(a.nombre)));
        return list;
    }

    private static List<EmpleadoPayload> sortEmpleadosByNombre(List<EmpleadoPayload> data) {
        List<EmpleadoPayload> list = new ArrayList<>(data);
        list.sort(Comparator.comparing(a -> safe(a.nombre)));
        return list;
    }

    private static List<RegistroPayload> sortByFechaDesc(List<RegistroPayload> data) {
        List<RegistroPayload> list = new ArrayList<>(data);
        list.sort((a, b) -> safe(b.fecha).compareTo(safe(a.fecha)));
        return list;
    }

    private static List<TareaAseoPayload> sortByCompletada(List<TareaAseoPayload> data) {
        List<TareaAseoPayload> list = new ArrayList<>(data);
        list.sort(Comparator.comparing(t -> t.completada));
        return list;
    }

    private static String safe(String value) {
        return value == null ? "" : value;
    }

    public record BootstrapResponse(
        List<ProductoPayload> productos,
        List<EmpleadoPayload> empleados,
        List<RegistroPayload> registros,
        List<TareaAseoPayload> tareasAseo
    ) {}

    public record ProductoPayload(
        String id,
        String nombre,
        Integer cantidad,
        String empresa,
        Integer ganancia,
        String fechaAsignacion,
        String fechaTerminacion,
        String estado
    ) {
        public ProductoPayload withId(String newId) {
            return new ProductoPayload(newId, nombre, cantidad, empresa, ganancia, fechaAsignacion, fechaTerminacion, estado);
        }
    }

    public record EmpleadoPayload(
        String id,
        String nombre,
        String cargo,
        String documento,
        String telefono,
        String fechaIngreso,
        String estado
    ) {
        public EmpleadoPayload withId(String newId) {
            return new EmpleadoPayload(newId, nombre, cargo, documento, telefono, fechaIngreso, estado);
        }
    }

    public static class RegistroPayload {
        public String id;
        public String empleadoId;
        public String fecha;
        public String horaEntrada;
        public String horaSalida;
        public Integer unidadesTotales;
        public Integer unidadesBuenas;
        public List<ProduccionRegistroPayload> producciones = new ArrayList<>();

        public RegistroPayload withId(String newId) {
            RegistroPayload copy = new RegistroPayload();
            copy.id = newId;
            copy.empleadoId = this.empleadoId;
            copy.fecha = this.fecha;
            copy.horaEntrada = this.horaEntrada;
            copy.horaSalida = this.horaSalida;
            copy.unidadesTotales = this.unidadesTotales;
            copy.unidadesBuenas = this.unidadesBuenas;
            copy.producciones = this.producciones == null ? new ArrayList<>() : new ArrayList<>(this.producciones);
            return copy;
        }
    }

    public static class ProduccionRegistroPayload {
        public String productoId;
        public Integer unidadesTotales;
        public Integer unidadesBuenas;
    }

    public record TareaAseoPayload(
        String id,
        String accion,
        String area,
        String encargado,
        boolean completada
    ) {
        public TareaAseoPayload withId(String newId) {
            return new TareaAseoPayload(newId, accion, area, encargado, completada);
        }
    }
}
