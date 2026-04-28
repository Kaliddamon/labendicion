package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.AsignacionAseo;
import dev.kali.labendicion.domain.entity.TareaAseo;
import dev.kali.labendicion.domain.entity.Empleado;
import dev.kali.labendicion.domain.entity.AreaTrabajo;
import dev.kali.labendicion.domain.dto.AseoDTO;
import dev.kali.labendicion.domain.enums.Turno;
import dev.kali.labendicion.service.AseoService;
import dev.kali.labendicion.service.EmpleadoService;
import dev.kali.labendicion.service.AreaTrabajoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/aseo")
public class AseoController {
    
    @Autowired
    private AseoService aseoService;
    
    @Autowired
    private EmpleadoService empleadoService;

    @Autowired
    private AreaTrabajoService areaTrabajoService;

    @PostMapping("/asignaciones")
    public ResponseEntity<AsignacionAseo> crearAsignacion(@RequestBody AseoDTO aseoDTO) {
        // Obtener empleado
        Empleado empleado = empleadoService.obtenerPorId(aseoDTO.getAsignadoA())
            .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + aseoDTO.getAsignadoA()));

        // Obtener o crear área de trabajo
        AreaTrabajo area = areaTrabajoService.obtenerPorNombre(aseoDTO.getArea())
            .orElseGet(() -> {
                AreaTrabajo nuevaArea = new AreaTrabajo();
                nuevaArea.setNombre(aseoDTO.getArea());
                nuevaArea.setDescripcion("Área de " + aseoDTO.getArea());
                nuevaArea.setActiva(true);
                return areaTrabajoService.crear(nuevaArea);
            });

        // Crear asignación de aseo
        AsignacionAseo asignacion = new AsignacionAseo();
        asignacion.setEmpleado(empleado);
        asignacion.setAreaTrabajo(area);
        asignacion.setTurno(Turno.MAÑANA);  // Por defecto
        asignacion.setFechaAsignacion(LocalDateTime.now());
        asignacion.setCompletada(false);

        AsignacionAseo asignacionCreada = aseoService.crearAsignacion(asignacion);

        // Crear tarea de aseo
        TareaAseo tarea = new TareaAseo();
        tarea.setAsignacionAseo(asignacionCreada);
        tarea.setDescripcion(aseoDTO.getTarea());
        tarea.setCompletada(false);

        aseoService.agregarTarea(tarea);

        return ResponseEntity.ok(asignacionCreada);
    }
    
    @GetMapping("/asignaciones")
    public ResponseEntity<List<AsignacionAseo>> obtenerTodasAsignaciones() {
        return ResponseEntity.ok(aseoService.obtenerTodas());
    }
    
    @GetMapping("/asignaciones/{id}")
    public ResponseEntity<AsignacionAseo> obtenerAsignacionPorId(@PathVariable Long id) {
        return aseoService.obtenerAsignacionPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/asignaciones/empleado/{empleadoId}")
    public ResponseEntity<List<AsignacionAseo>> obtenerPorEmpleado(@PathVariable Long empleadoId) {
        return ResponseEntity.ok(aseoService.obtenerPorEmpleado(empleadoId));
    }
    
    @GetMapping("/asignaciones/area/{areaId}")
    public ResponseEntity<List<AsignacionAseo>> obtenerPorArea(@PathVariable Long areaId) {
        return ResponseEntity.ok(aseoService.obtenerPorArea(areaId));
    }
    
    @GetMapping("/asignaciones/turno/{turno}")
    public ResponseEntity<List<AsignacionAseo>> obtenerPorTurno(@PathVariable Turno turno) {
        return ResponseEntity.ok(aseoService.obtenerPorTurno(turno));
    }
    
    @GetMapping("/asignaciones/no-completadas")
    public ResponseEntity<List<AsignacionAseo>> obtenerNoCompletadas() {
        return ResponseEntity.ok(aseoService.obtenerNoCompletadas());
    }
    
    @PutMapping("/asignaciones/{id}/completada")
    public ResponseEntity<AsignacionAseo> marcarCompletada(@PathVariable Long id) {
        return ResponseEntity.ok(aseoService.marcarCompletada(id));
    }
    
    @DeleteMapping("/asignaciones/{id}")
    public ResponseEntity<Void> eliminarAsignacion(@PathVariable Long id) {
        aseoService.eliminarAsignacion(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/tareas")
    public ResponseEntity<TareaAseo> agregarTarea(@RequestBody TareaAseo tarea) {
        return ResponseEntity.ok(aseoService.agregarTarea(tarea));
    }
    
    @GetMapping("/tareas/asignacion/{asignacionId}")
    public ResponseEntity<List<TareaAseo>> obtenerTareasPorAsignacion(@PathVariable Long asignacionId) {
        return ResponseEntity.ok(aseoService.obtenerTareasPorAsignacion(asignacionId));
    }
    
    @PutMapping("/tareas/{tareaId}/completada")
    public ResponseEntity<TareaAseo> marcarTareaCompletada(@PathVariable Long tareaId) {
        return ResponseEntity.ok(aseoService.marcarTareaCompletada(tareaId));
    }
}

