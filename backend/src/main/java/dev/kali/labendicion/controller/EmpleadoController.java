package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.Empleado;
import dev.kali.labendicion.domain.dto.EmpleadoDTO;
import dev.kali.labendicion.domain.enums.Cargo;
import dev.kali.labendicion.domain.enums.Turno;
import dev.kali.labendicion.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {
    
    @Autowired
    private EmpleadoService empleadoService;
    
    @PostMapping
    public ResponseEntity<Empleado> crear(@Valid @RequestBody EmpleadoDTO empleadoDTO) {
        // Mapear DTO a entidad
        Empleado empleado = new Empleado();

        // El frontend envía "nombreCompleto", separamos en nombre y apellido
        String[] nombres = empleadoDTO.getNombreCompleto().trim().split(" ", 2);
        empleado.setNombre(nombres[0]);
        empleado.setApellido(nombres.length > 1 ? nombres[1] : "");

        empleado.setNumeroIdentificacion(empleadoDTO.getDocumento());
        empleado.setSalario(empleadoDTO.getSalario().doubleValue());
        empleado.setFechaIngreso(empleadoDTO.getFechaIngreso().atStartOfDay());
        empleado.setActivo(true);

        // Mapear el cargo (el frontend envía string, el backend espera enum)
        try {
            // Intentar mapeos comunes de frontend a backend
            String cargoStr = empleadoDTO.getCargo().toUpperCase()
                .replace("COSTURERO/A", "CONFECCIONISTA")
                .replace("COSTURERO", "CONFECCIONISTA")
                .replace("CORTADOR", "CORTADOR")
                .replace("SUPERVISOR", "SUPERVISOR")
                .replace("ADMINISTRATIVO", "ASISTENTE")
                .replace("MANTENIMIENTO", "ASISTENTE");

            Cargo cargo = Cargo.valueOf(cargoStr);
            empleado.setCargo(cargo);
        } catch (IllegalArgumentException e) {
            // Si no puede mapear, asignar un cargo por defecto
            empleado.setCargo(Cargo.ASISTENTE);
        }

        // Asignar turno por defecto
        empleado.setTurno(Turno.MAÑANA);

        return ResponseEntity.ok(empleadoService.crearEmpleado(empleado));
    }
    
    @GetMapping
    public ResponseEntity<List<Empleado>> obtenerTodos() {
        return ResponseEntity.ok(empleadoService.obtenerTodos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Empleado> obtenerPorId(@PathVariable Long id) {
        return empleadoService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/activos")
    public ResponseEntity<List<Empleado>> obtenerActivos() {
        return ResponseEntity.ok(empleadoService.obtenerActivos());
    }
    
    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<Empleado>> obtenerPorCargo(@PathVariable Cargo cargo) {
        return ResponseEntity.ok(empleadoService.obtenerPorCargo(cargo));
    }
    
    @GetMapping("/turno/{turno}")
    public ResponseEntity<List<Empleado>> obtenerPorTurno(@PathVariable Turno turno) {
        return ResponseEntity.ok(empleadoService.obtenerPorTurno(turno));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Empleado> actualizar(@PathVariable Long id, @Valid @RequestBody Empleado empleado) {
        return ResponseEntity.ok(empleadoService.actualizar(id, empleado));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        empleadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/identificacion/{numeroId}")
    public ResponseEntity<Empleado> obtenerPorIdentificacion(@PathVariable String numeroId) {
        return empleadoService.obtenerPorIdentificacion(numeroId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}

