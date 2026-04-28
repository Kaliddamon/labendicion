package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.EvaluacionEmpleado;
import dev.kali.labendicion.repository.EvaluacionEmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EvaluacionEmpleadoService {
    
    @Autowired
    private EvaluacionEmpleadoRepository evaluacionRepository;
    
    public EvaluacionEmpleado crearEvaluacion(EvaluacionEmpleado evaluacion) {
        return evaluacionRepository.save(evaluacion);
    }
    
    public Optional<EvaluacionEmpleado> obtenerPorId(Long id) {
        return evaluacionRepository.findById(id);
    }
    
    public List<EvaluacionEmpleado> obtenerTodas() {
        return evaluacionRepository.findAll();
    }
    
    public List<EvaluacionEmpleado> obtenerPorEmpleado(Long empleadoId) {
        return evaluacionRepository.findByEmpleadoId(empleadoId);
    }
    
    public Double calcularPromedioEmpleado(Long empleadoId) {
        List<EvaluacionEmpleado> evaluaciones = obtenerPorEmpleado(empleadoId);
        if (evaluaciones.isEmpty()) {
            return 0.0;
        }
        return evaluaciones.stream()
            .mapToDouble(EvaluacionEmpleado::getCalificacion)
            .average()
            .orElse(0.0);
    }
    
    public Double calcularPromedioGeneral() {
        List<EvaluacionEmpleado> evaluaciones = obtenerTodas();
        if (evaluaciones.isEmpty()) {
            return 0.0;
        }
        return evaluaciones.stream()
            .mapToDouble(EvaluacionEmpleado::getCalificacion)
            .average()
            .orElse(0.0);
    }
    
    public void eliminar(Long id) {
        evaluacionRepository.deleteById(id);
    }
}

