package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.EvaluacionEmpleado;
import dev.kali.labendicion.service.EvaluacionEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {
    
    @Autowired
    private EvaluacionEmpleadoService evaluacionService;
    
    @PostMapping
    public ResponseEntity<EvaluacionEmpleado> crear(@RequestBody EvaluacionEmpleado evaluacion) {
        return ResponseEntity.ok(evaluacionService.crearEvaluacion(evaluacion));
    }
    
    @GetMapping
    public ResponseEntity<List<EvaluacionEmpleado>> obtenerTodas() {
        return ResponseEntity.ok(evaluacionService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EvaluacionEmpleado> obtenerPorId(@PathVariable Long id) {
        return evaluacionService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/empleado/{empleadoId}")
    public ResponseEntity<List<EvaluacionEmpleado>> obtenerPorEmpleado(@PathVariable Long empleadoId) {
        return ResponseEntity.ok(evaluacionService.obtenerPorEmpleado(empleadoId));
    }
    
    @GetMapping("/empleado/{empleadoId}/promedio")
    public ResponseEntity<Double> calcularPromedioEmpleado(@PathVariable Long empleadoId) {
        Double promedio = evaluacionService.calcularPromedioEmpleado(empleadoId);
        return ResponseEntity.ok(promedio);
    }
    
    @GetMapping("/promedio-general")
    public ResponseEntity<Double> calcularPromedioGeneral() {
        Double promedio = evaluacionService.calcularPromedioGeneral();
        return ResponseEntity.ok(promedio);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        evaluacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

