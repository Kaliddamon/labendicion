package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.Maquina;
import dev.kali.labendicion.domain.entity.MantenimientoMaquina;
import dev.kali.labendicion.domain.enums.TipoMaquina;
import dev.kali.labendicion.domain.enums.TipoMantenimiento;
import dev.kali.labendicion.repository.MaquinaRepository;
import dev.kali.labendicion.repository.MantenimientoMaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MaquinaService {
    
    @Autowired
    private MaquinaRepository maquinaRepository;
    
    @Autowired
    private MantenimientoMaquinaRepository mantenimientoRepository;
    
    public Maquina crearMaquina(Maquina maquina) {
        return maquinaRepository.save(maquina);
    }
    
    public Optional<Maquina> obtenerPorId(Long id) {
        return maquinaRepository.findById(id);
    }
    
    public List<Maquina> obtenerTodas() {
        return maquinaRepository.findAll();
    }
    
    public List<Maquina> obtenerPorArea(Long areaId) {
        return maquinaRepository.findByAreaTrabajoId(areaId);
    }
    
    public List<Maquina> obtenerPorTipo(TipoMaquina tipo) {
        return maquinaRepository.findByTipoMaquina(tipo);
    }
    
    public List<Maquina> obtenerOperativas() {
        return maquinaRepository.findByOperativa(true);
    }
    
    public Maquina actualizarEstadoOperativo(Long id, Boolean operativa) {
        return maquinaRepository.findById(id)
            .map(m -> {
                m.setOperativa(operativa);
                return maquinaRepository.save(m);
            })
            .orElseThrow(() -> new RuntimeException("Máquina no encontrada"));
    }
    
    public MantenimientoMaquina registrarMantenimiento(MantenimientoMaquina mantenimiento) {
        return mantenimientoRepository.save(mantenimiento);
    }
    
    public List<MantenimientoMaquina> obtenerMantenimientoPorMaquina(Long maquinaId) {
        return mantenimientoRepository.findByMaquinaId(maquinaId);
    }
    
    public List<MantenimientoMaquina> obtenerMantenimientoPorTipo(TipoMantenimiento tipo) {
        return mantenimientoRepository.findByTipoMantenimiento(tipo);
    }
    
    public void eliminar(Long id) {
        maquinaRepository.deleteById(id);
    }
}

