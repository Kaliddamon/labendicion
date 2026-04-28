package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.Maquina;
import dev.kali.labendicion.domain.entity.MantenimientoMaquina;
import dev.kali.labendicion.domain.enums.TipoMaquina;
import dev.kali.labendicion.domain.enums.TipoMantenimiento;
import dev.kali.labendicion.service.MaquinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maquinas")
public class MaquinaController {
    
    @Autowired
    private MaquinaService maquinaService;
    
    @PostMapping
    public ResponseEntity<Maquina> crear(@RequestBody Maquina maquina) {
        return ResponseEntity.ok(maquinaService.crearMaquina(maquina));
    }
    
    @GetMapping
    public ResponseEntity<List<Maquina>> obtenerTodas() {
        return ResponseEntity.ok(maquinaService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Maquina> obtenerPorId(@PathVariable Long id) {
        return maquinaService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<Maquina>> obtenerPorArea(@PathVariable Long areaId) {
        return ResponseEntity.ok(maquinaService.obtenerPorArea(areaId));
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Maquina>> obtenerPorTipo(@PathVariable TipoMaquina tipo) {
        return ResponseEntity.ok(maquinaService.obtenerPorTipo(tipo));
    }
    
    @GetMapping("/operativas")
    public ResponseEntity<List<Maquina>> obtenerOperativas() {
        return ResponseEntity.ok(maquinaService.obtenerOperativas());
    }
    
    @PutMapping("/{id}/operativa/{operativa}")
    public ResponseEntity<Maquina> actualizarEstadoOperativo(@PathVariable Long id, @PathVariable Boolean operativa) {
        return ResponseEntity.ok(maquinaService.actualizarEstadoOperativo(id, operativa));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        maquinaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{maquinaId}/mantenimientos")
    public ResponseEntity<MantenimientoMaquina> registrarMantenimiento(@PathVariable Long maquinaId, @RequestBody MantenimientoMaquina mantenimiento) {
        maquinaService.obtenerPorId(maquinaId)
            .ifPresent(mantenimiento::setMaquina);
        return ResponseEntity.ok(maquinaService.registrarMantenimiento(mantenimiento));
    }
    
    @GetMapping("/{maquinaId}/mantenimientos")
    public ResponseEntity<List<MantenimientoMaquina>> obtenerMantenimientos(@PathVariable Long maquinaId) {
        return ResponseEntity.ok(maquinaService.obtenerMantenimientoPorMaquina(maquinaId));
    }
    
    @GetMapping("/mantenimientos/tipo/{tipo}")
    public ResponseEntity<List<MantenimientoMaquina>> obtenerMantenimientosPorTipo(@PathVariable TipoMantenimiento tipo) {
        return ResponseEntity.ok(maquinaService.obtenerMantenimientoPorTipo(tipo));
    }
}

