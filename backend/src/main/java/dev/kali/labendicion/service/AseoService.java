package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.AsignacionAseo;
import dev.kali.labendicion.domain.entity.TareaAseo;
import dev.kali.labendicion.domain.enums.Turno;
import dev.kali.labendicion.repository.AsignacionAseoRepository;
import dev.kali.labendicion.repository.TareaAseoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AseoService {
    
    @Autowired
    private AsignacionAseoRepository asignacionAseoRepository;
    
    @Autowired
    private TareaAseoRepository tareaAseoRepository;
    
    public AsignacionAseo crearAsignacion(AsignacionAseo asignacion) {
        return asignacionAseoRepository.save(asignacion);
    }
    
    public Optional<AsignacionAseo> obtenerAsignacionPorId(Long id) {
        return asignacionAseoRepository.findById(id);
    }
    
    public List<AsignacionAseo> obtenerTodas() {
        return asignacionAseoRepository.findAll();
    }
    
    public List<AsignacionAseo> obtenerPorEmpleado(Long empleadoId) {
        return asignacionAseoRepository.findByEmpleadoId(empleadoId);
    }
    
    public List<AsignacionAseo> obtenerPorArea(Long areaId) {
        return asignacionAseoRepository.findByAreaTrabajoId(areaId);
    }
    
    public List<AsignacionAseo> obtenerPorTurno(Turno turno) {
        return asignacionAseoRepository.findByTurno(turno);
    }
    
    public List<AsignacionAseo> obtenerNoCompletadas() {
        return asignacionAseoRepository.findByCompletada(false);
    }
    
    public AsignacionAseo marcarCompletada(Long asignacionId) {
        return asignacionAseoRepository.findById(asignacionId)
            .map(a -> {
                a.setCompletada(true);
                return asignacionAseoRepository.save(a);
            })
            .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));
    }
    
    public TareaAseo agregarTarea(TareaAseo tarea) {
        return tareaAseoRepository.save(tarea);
    }
    
    public List<TareaAseo> obtenerTareasPorAsignacion(Long asignacionId) {
        return tareaAseoRepository.findByAsignacionAseoId(asignacionId);
    }
    
    public TareaAseo marcarTareaCompletada(Long tareaId) {
        return tareaAseoRepository.findById(tareaId)
            .map(t -> {
                t.setCompletada(true);
                t.setHoraCompletacion(java.time.LocalDateTime.now());
                return tareaAseoRepository.save(t);
            })
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }
    
    public void eliminarAsignacion(Long id) {
        asignacionAseoRepository.deleteById(id);
    }
}

