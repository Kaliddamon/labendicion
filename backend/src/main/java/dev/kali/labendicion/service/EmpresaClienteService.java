package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.EmpresaCliente;
import dev.kali.labendicion.repository.EmpresaClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EmpresaClienteService {
    
    @Autowired
    private EmpresaClienteRepository empresaClienteRepository;
    
    public EmpresaCliente crearEmpresa(EmpresaCliente empresa) {
        return empresaClienteRepository.save(empresa);
    }
    
    public Optional<EmpresaCliente> obtenerPorId(Long id) {
        return empresaClienteRepository.findById(id);
    }
    
    public List<EmpresaCliente> obtenerTodas() {
        return empresaClienteRepository.findAll();
    }
    
    public EmpresaCliente actualizar(Long id, EmpresaCliente empresa) {
        return empresaClienteRepository.findById(id)
            .map(e -> {
                e.setNombre(empresa.getNombre());
                e.setEmail(empresa.getEmail());
                e.setTelefono(empresa.getTelefono());
                e.setDireccion(empresa.getDireccion());
                e.setContactoPersona(empresa.getContactoPersona());
                return empresaClienteRepository.save(e);
            })
            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }
    
    public void eliminar(Long id) {
        empresaClienteRepository.deleteById(id);
    }
    
    public Optional<EmpresaCliente> obtenerPorNit(String nit) {
        return empresaClienteRepository.findByNit(nit);
    }
}

