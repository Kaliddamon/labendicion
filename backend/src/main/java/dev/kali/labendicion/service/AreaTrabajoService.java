package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.AreaTrabajo;
import dev.kali.labendicion.repository.AreaTrabajoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AreaTrabajoService {
    
    @Autowired
    private AreaTrabajoRepository areaTrabajoRepository;
    
    public AreaTrabajo crear(AreaTrabajo areaTrabajo) {
        return areaTrabajoRepository.save(areaTrabajo);
    }
    
    public Optional<AreaTrabajo> obtenerPorId(Long id) {
        return areaTrabajoRepository.findById(id);
    }
    
    public Optional<AreaTrabajo> obtenerPorNombre(String nombre) {
        return areaTrabajoRepository.findByNombre(nombre);
    }

    public List<AreaTrabajo> obtenerTodas() {
        return areaTrabajoRepository.findAll();
    }
    
    public List<AreaTrabajo> obtenerActivas() {
        return areaTrabajoRepository.findByActiva(true);
    }
    
    public AreaTrabajo actualizar(Long id, AreaTrabajo areaTrabajo) {
        return areaTrabajoRepository.findById(id)
            .map(a -> {
                a.setNombre(areaTrabajo.getNombre());
                a.setDescripcion(areaTrabajo.getDescripcion());
                a.setActiva(areaTrabajo.getActiva());
                return areaTrabajoRepository.save(a);
            })
            .orElseThrow(() -> new RuntimeException("Área de trabajo no encontrada"));
    }
    
    public void eliminar(Long id) {
        areaTrabajoRepository.deleteById(id);
    }
}

