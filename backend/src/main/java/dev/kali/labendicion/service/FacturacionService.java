package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.Factura;
import dev.kali.labendicion.domain.entity.Pago;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.repository.FacturaRepository;
import dev.kali.labendicion.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FacturacionService {
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    @Autowired
    private PagoRepository pagoRepository;
    
    public Factura crearFactura(Factura factura) {
        return facturaRepository.save(factura);
    }
    
    public Optional<Factura> obtenerPorId(Long id) {
        return facturaRepository.findById(id);
    }
    
    public List<Factura> obtenerTodas() {
        return facturaRepository.findAll();
    }
    
    public List<Factura> obtenerPorEstado(Estado estado) {
        return facturaRepository.findByEstado(estado);
    }
    
    public List<Factura> obtenerPorEmpresa(Long empresaClienteId) {
        return facturaRepository.findByEmpresaClienteId(empresaClienteId);
    }
    
    public List<Factura> obtenerPendientesPorEmpresa(Long empresaClienteId) {
        return facturaRepository.findByEstadoAndEmpresaClienteId(Estado.PENDIENTE, empresaClienteId);
    }
    
    public Factura obtenerPorPedido(Long pedidoServicioId) {
        return facturaRepository.findByPedidoServicioId(pedidoServicioId);
    }
    
    public Pago registrarPago(Long facturaId, Pago pago) {
        Factura factura = facturaRepository.findById(facturaId)
            .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        
        pago.setFactura(factura);
        factura.setMontoPagado(factura.getMontoPagado() + pago.getMonto());
        
        if (factura.getMontoPagado() >= factura.getMonto()) {
            factura.setEstado(Estado.COMPLETADO);
        }
        
        facturaRepository.save(factura);
        return pagoRepository.save(pago);
    }
    
    public Pago obtenerPagoPorFactura(Long facturaId) {
        return pagoRepository.findByFacturaId(facturaId);
    }
    
    public void eliminar(Long id) {
        facturaRepository.deleteById(id);
    }
}

