package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.AreaTrabajo;
import dev.kali.labendicion.service.AreaTrabajoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/areas-trabajo")
public class AreaTrabajoController {
    
    @Autowired
    private AreaTrabajoService areaTrabajoService;
    
    @PostMapping
    public ResponseEntity<AreaTrabajo> crear(@RequestBody AreaTrabajo areaTrabajo) {
        return ResponseEntity.ok(areaTrabajoService.crear(areaTrabajo));
    }
    
    @GetMapping
    public ResponseEntity<List<AreaTrabajo>> obtenerTodas() {
        return ResponseEntity.ok(areaTrabajoService.obtenerTodas());
    }
    
    @GetMapping("/activas")
    public ResponseEntity<List<AreaTrabajo>> obtenerActivas() {
        return ResponseEntity.ok(areaTrabajoService.obtenerActivas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AreaTrabajo> obtenerPorId(@PathVariable Long id) {
        return areaTrabajoService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AreaTrabajo> actualizar(@PathVariable Long id, @RequestBody AreaTrabajo areaTrabajo) {
        return ResponseEntity.ok(areaTrabajoService.actualizar(id, areaTrabajo));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        areaTrabajoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

