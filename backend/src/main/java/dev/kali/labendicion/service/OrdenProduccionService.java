package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.OrdenProduccion;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.repository.OrdenProduccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenProduccionService {
    
    @Autowired
    private OrdenProduccionRepository ordenProduccionRepository;
    
    public OrdenProduccion crearOrden(OrdenProduccion orden) {
        return ordenProduccionRepository.save(orden);
    }
    
    public Optional<OrdenProduccion> obtenerPorId(Long id) {
        return ordenProduccionRepository.findById(id);
    }
    
    public List<OrdenProduccion> obtenerTodas() {
        return ordenProduccionRepository.findAll();
    }
    
    public List<OrdenProduccion> obtenerPorEstado(Estado estado) {
        return ordenProduccionRepository.findByEstado(estado);
    }
    
    public List<OrdenProduccion> obtenerPorPedido(Long pedidoId) {
        return ordenProduccionRepository.findByPedidoServicioId(pedidoId);
    }
    
    public List<OrdenProduccion> obtenerPorArea(Long areaId) {
        return ordenProduccionRepository.findByAreaTrabajoId(areaId);
    }
    
    public OrdenProduccion actualizarProgreso(Long id, Integer progreso) {
        return ordenProduccionRepository.findById(id)
            .map(o -> {
                o.setProgreso(progreso);
                if (progreso >= 100) {
                    o.setEstado(Estado.COMPLETADO);
                    o.setFechaCompletacion(LocalDateTime.now());
                }
                return ordenProduccionRepository.save(o);
            })
            .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }
    
    public OrdenProduccion marcarCompletada(Long id) {
        return ordenProduccionRepository.findById(id)
            .map(o -> {
                o.setEstado(Estado.COMPLETADO);
                o.setProgreso(100);
                o.setFechaCompletacion(LocalDateTime.now());
                return ordenProduccionRepository.save(o);
            })
            .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }
    
    public void eliminar(Long id) {
        ordenProduccionRepository.deleteById(id);
    }
}

