package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.Empleado;
import dev.kali.labendicion.domain.enums.Cargo;
import dev.kali.labendicion.domain.enums.Turno;
import dev.kali.labendicion.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {
    
    @Autowired
    private EmpleadoRepository empleadoRepository;
    
    public Empleado crearEmpleado(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }
    
    public Optional<Empleado> obtenerPorId(Long id) {
        return empleadoRepository.findById(id);
    }
    
    public List<Empleado> obtenerTodos() {
        return empleadoRepository.findAll();
    }
    
    public List<Empleado> obtenerPorCargo(Cargo cargo) {
        return empleadoRepository.findByCargo(cargo);
    }
    
    public List<Empleado> obtenerPorTurno(Turno turno) {
        return empleadoRepository.findByTurno(turno);
    }
    
    public List<Empleado> obtenerActivos() {
        return empleadoRepository.findByActivo(true);
    }
    
    public Empleado actualizar(Long id, Empleado empleado) {
        return empleadoRepository.findById(id)
            .map(e -> {
                e.setNombre(empleado.getNombre());
                e.setApellido(empleado.getApellido());
                e.setEmail(empleado.getEmail());
                e.setTelefono(empleado.getTelefono());
                e.setCargo(empleado.getCargo());
                e.setTurno(empleado.getTurno());
                e.setSalario(empleado.getSalario());
                e.setActivo(empleado.getActivo());
                return empleadoRepository.save(e);
            })
            .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }
    
    public void eliminar(Long id) {
        empleadoRepository.deleteById(id);
    }
    
    public Optional<Empleado> obtenerPorIdentificacion(String numeroIdentificacion) {
        return empleadoRepository.findByNumeroIdentificacion(numeroIdentificacion);
    }
}

