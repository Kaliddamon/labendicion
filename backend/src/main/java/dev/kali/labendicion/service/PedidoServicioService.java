package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.PedidoServicio;
import dev.kali.labendicion.domain.entity.DetallePedido;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.domain.enums.Prioridad;
import dev.kali.labendicion.repository.PedidoServicioRepository;
import dev.kali.labendicion.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoServicioService {
    
    @Autowired
    private PedidoServicioRepository pedidoServicioRepository;
    
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;
    
    public PedidoServicio crearPedido(PedidoServicio pedido) {
        return pedidoServicioRepository.save(pedido);
    }
    
    public Optional<PedidoServicio> obtenerPorId(Long id) {
        return pedidoServicioRepository.findById(id);
    }
    
    public List<PedidoServicio> obtenerTodos() {
        return pedidoServicioRepository.findAll();
    }
    
    public List<PedidoServicio> obtenerPorEstado(Estado estado) {
        return pedidoServicioRepository.findByEstado(estado);
    }
    
    public List<PedidoServicio> obtenerPorPrioridad(Prioridad prioridad) {
        return pedidoServicioRepository.findByPrioridad(prioridad);
    }
    
    public List<PedidoServicio> obtenerPorEmpresa(Long empresaClienteId) {
        return pedidoServicioRepository.findByEmpresaClienteId(empresaClienteId);
    }
    
    public PedidoServicio actualizarEstado(Long id, Estado nuevoEstado) {
        return pedidoServicioRepository.findById(id)
            .map(p -> {
                p.setEstado(nuevoEstado);
                return pedidoServicioRepository.save(p);
            })
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }
    
    public PedidoServicio actualizarPrioridad(Long id, Prioridad nuevaPrioridad) {
        return pedidoServicioRepository.findById(id)
            .map(p -> {
                p.setPrioridad(nuevaPrioridad);
                return pedidoServicioRepository.save(p);
            })
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }
    
    public void eliminar(Long id) {
        pedidoServicioRepository.deleteById(id);
    }
    
    public List<DetallePedido> obtenerDetallesPedido(Long pedidoId) {
        return detallePedidoRepository.findByPedidoServicioId(pedidoId);
    }
    
    public DetallePedido agregarDetallePedido(DetallePedido detalle) {
        return detallePedidoRepository.save(detalle);
    }
}

