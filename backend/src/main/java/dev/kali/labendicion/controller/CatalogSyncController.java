package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.*;
import dev.kali.labendicion.repository.*;
import dev.kali.labendicion.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/frontend")
public class CatalogSyncController {

    @Autowired private AccionProduccionSyncRepository accionProduccionRepo;
    @Autowired private CargoEmpleadoSyncRepository cargoRepo;
    @Autowired private AreaTrabajoSyncRepository areaRepo;
    @Autowired private AccionAseoSyncRepository accionAseoRepo;
    @Autowired private EventService eventService;

    // --- Acciones de producción ---
    @GetMapping("/acciones-produccion")
    public ResponseEntity<?> listarAccionesProduccion(@RequestParam(required = false) Boolean soloActivas) {
        var list = Boolean.TRUE.equals(soloActivas)
                ? accionProduccionRepo.findAllByActivaTrueOrderByOrdenAscNombreAsc()
                : accionProduccionRepo.findAllByOrderByOrdenAscNombreAsc();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/acciones-produccion")
    public ResponseEntity<AccionProduccionSync> crearAccionProduccion(@RequestBody AccionProduccionSync body) {
        normalizarIdNuevo(body);
        if (body.getActiva() == null) body.setActiva(true);
        AccionProduccionSync saved = accionProduccionRepo.save(body);
        eventService.emitAsync("ACCION_PRODUCCION_CREADA", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/acciones-produccion/{id}")
    public ResponseEntity<AccionProduccionSync> actualizarAccionProduccion(@PathVariable String id, @RequestBody AccionProduccionSync body) {
        return accionProduccionRepo.findById(id)
                .map(existing -> {
                    if (body.getNombre() != null && !body.getNombre().isBlank()) existing.setNombre(body.getNombre().trim());
                    if (body.getOrden() != null) existing.setOrden(body.getOrden());
                    if (body.getActiva() != null) existing.setActiva(body.getActiva());
                    AccionProduccionSync saved = accionProduccionRepo.save(existing);
                    eventService.emitAsync("ACCION_PRODUCCION_ACTUALIZADA", saved);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/acciones-produccion/{id}")
    public ResponseEntity<Void> eliminarAccionProduccion(@PathVariable String id) {
        accionProduccionRepo.deleteById(id);
        eventService.emitAsync("ACCION_PRODUCCION_ELIMINADA", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    // --- Cargos de empleado ---
    @GetMapping("/cargos")
    public ResponseEntity<?> listarCargos(@RequestParam(required = false) Boolean soloActivas) {
        var list = Boolean.TRUE.equals(soloActivas)
                ? cargoRepo.findAllByActivaTrueOrderByNombreAsc()
                : cargoRepo.findAllByOrderByNombreAsc();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/cargos")
    public ResponseEntity<CargoEmpleadoSync> crearCargo(@RequestBody CargoEmpleadoSync body) {
        normalizarIdNuevo(body);
        if (body.getActiva() == null) body.setActiva(true);
        CargoEmpleadoSync saved = cargoRepo.save(body);
        eventService.emitAsync("CARGO_CREADO", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/cargos/{id}")
    public ResponseEntity<CargoEmpleadoSync> actualizarCargo(@PathVariable String id, @RequestBody CargoEmpleadoSync body) {
        return cargoRepo.findById(id)
                .map(existing -> {
                    if (body.getNombre() != null && !body.getNombre().isBlank()) existing.setNombre(body.getNombre().trim());
                    if (body.getActiva() != null) existing.setActiva(body.getActiva());
                    CargoEmpleadoSync saved = cargoRepo.save(existing);
                    eventService.emitAsync("CARGO_ACTUALIZADO", saved);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/cargos/{id}")
    public ResponseEntity<Void> eliminarCargo(@PathVariable String id) {
        cargoRepo.deleteById(id);
        eventService.emitAsync("CARGO_ELIMINADO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    // --- Áreas de trabajo ---
    @GetMapping("/areas-trabajo")
    public ResponseEntity<?> listarAreas(@RequestParam(required = false) Boolean soloActivas) {
        var list = Boolean.TRUE.equals(soloActivas)
                ? areaRepo.findAllByActivaTrueOrderByNombreAsc()
                : areaRepo.findAllByOrderByNombreAsc();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/areas-trabajo")
    public ResponseEntity<AreaTrabajoSync> crearArea(@RequestBody AreaTrabajoSync body) {
        normalizarIdNuevo(body);
        if (body.getActiva() == null) body.setActiva(true);
        AreaTrabajoSync saved = areaRepo.save(body);
        eventService.emitAsync("AREA_TRABAJO_CREADA", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/areas-trabajo/{id}")
    public ResponseEntity<AreaTrabajoSync> actualizarArea(@PathVariable String id, @RequestBody AreaTrabajoSync body) {
        return areaRepo.findById(id)
                .map(existing -> {
                    if (body.getNombre() != null && !body.getNombre().isBlank()) existing.setNombre(body.getNombre().trim());
                    if (body.getDescripcion() != null) existing.setDescripcion(body.getDescripcion());
                    if (body.getActiva() != null) existing.setActiva(body.getActiva());
                    AreaTrabajoSync saved = areaRepo.save(existing);
                    eventService.emitAsync("AREA_TRABAJO_ACTUALIZADA", saved);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/areas-trabajo/{id}")
    public ResponseEntity<Void> eliminarArea(@PathVariable String id) {
        areaRepo.deleteById(id);
        eventService.emitAsync("AREA_TRABAJO_ELIMINADA", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    // --- Acciones de aseo ---
    @GetMapping("/acciones-aseo")
    public ResponseEntity<?> listarAccionesAseo(@RequestParam(required = false) Boolean soloActivas) {
        var list = Boolean.TRUE.equals(soloActivas)
                ? accionAseoRepo.findAllByActivaTrueOrderByNombreAsc()
                : accionAseoRepo.findAllByOrderByNombreAsc();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/acciones-aseo")
    public ResponseEntity<AccionAseoSync> crearAccionAseo(@RequestBody AccionAseoSync body) {
        normalizarIdNuevo(body);
        if (body.getActiva() == null) body.setActiva(true);
        AccionAseoSync saved = accionAseoRepo.save(body);
        eventService.emitAsync("ACCION_ASEO_CREADA", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/acciones-aseo/{id}")
    public ResponseEntity<AccionAseoSync> actualizarAccionAseo(@PathVariable String id, @RequestBody AccionAseoSync body) {
        return accionAseoRepo.findById(id)
                .map(existing -> {
                    if (body.getNombre() != null && !body.getNombre().isBlank()) existing.setNombre(body.getNombre().trim());
                    if (body.getActiva() != null) existing.setActiva(body.getActiva());
                    AccionAseoSync saved = accionAseoRepo.save(existing);
                    eventService.emitAsync("ACCION_ASEO_ACTUALIZADA", saved);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/acciones-aseo/{id}")
    public ResponseEntity<Void> eliminarAccionAseo(@PathVariable String id) {
        accionAseoRepo.deleteById(id);
        eventService.emitAsync("ACCION_ASEO_ELIMINADA", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    private static void normalizarIdNuevo(AccionProduccionSync body) {
        if (body.getId() == null || body.getId().isBlank() || body.getId().startsWith("tmp-")) {
            body.setId(generateId());
        }
    }

    private static void normalizarIdNuevo(CargoEmpleadoSync body) {
        if (body.getId() == null || body.getId().isBlank() || body.getId().startsWith("tmp-")) {
            body.setId(generateId());
        }
    }

    private static void normalizarIdNuevo(AreaTrabajoSync body) {
        if (body.getId() == null || body.getId().isBlank() || body.getId().startsWith("tmp-")) {
            body.setId(generateId());
        }
    }

    private static void normalizarIdNuevo(AccionAseoSync body) {
        if (body.getId() == null || body.getId().isBlank() || body.getId().startsWith("tmp-")) {
            body.setId(generateId());
        }
    }

    private static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
