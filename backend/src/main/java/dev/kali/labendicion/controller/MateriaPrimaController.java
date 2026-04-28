package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.MateriaPrimaRecibida;
import dev.kali.labendicion.domain.enums.TipoMaterial;
import dev.kali.labendicion.repository.MateriaPrimaRecibidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materias-primas")
public class MateriaPrimaController {
    
    @Autowired
    private MateriaPrimaRecibidaRepository materiaPrimaRepository;
    
    @PostMapping
    public ResponseEntity<MateriaPrimaRecibida> crear(@RequestBody MateriaPrimaRecibida materiaPrima) {
        return ResponseEntity.ok(materiaPrimaRepository.save(materiaPrima));
    }
    
    @GetMapping
    public ResponseEntity<List<MateriaPrimaRecibida>> obtenerTodas() {
        return ResponseEntity.ok(materiaPrimaRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MateriaPrimaRecibida> obtenerPorId(@PathVariable Long id) {
        return materiaPrimaRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<MateriaPrimaRecibida>> obtenerPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(materiaPrimaRepository.findByEmpresaClienteId(empresaId));
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<MateriaPrimaRecibida>> obtenerPorTipo(@PathVariable TipoMaterial tipo) {
        return ResponseEntity.ok(materiaPrimaRepository.findByTipoMaterial(tipo));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MateriaPrimaRecibida> actualizar(@PathVariable Long id, @RequestBody MateriaPrimaRecibida materiaPrima) {
        return materiaPrimaRepository.findById(id)
            .map(m -> {
                m.setDescripcion(materiaPrima.getDescripcion());
                m.setCantidad(materiaPrima.getCantidad());
                m.setUnidad(materiaPrima.getUnidad());
                m.setLote(materiaPrima.getLote());
                return ResponseEntity.ok(materiaPrimaRepository.save(m));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        materiaPrimaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

