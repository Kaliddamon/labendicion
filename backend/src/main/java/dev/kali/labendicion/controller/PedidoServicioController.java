package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.PedidoServicio;
import dev.kali.labendicion.domain.entity.EmpresaCliente;
import dev.kali.labendicion.domain.entity.DetallePedido;
import dev.kali.labendicion.domain.dto.PedidoDTO;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.domain.enums.Prioridad;
import dev.kali.labendicion.service.PedidoServicioService;
import dev.kali.labendicion.service.EmpresaClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos de Servicio", description = "Gestión de solicitudes de confección de clientes")
public class PedidoServicioController {
    
    @Autowired
    private PedidoServicioService pedidoServicioService;
    
    @Autowired
    private EmpresaClienteService empresaClienteService;

    @PostMapping
    @Operation(summary = "Crear nuevo pedido", description = "Crea una nueva solicitud de confección")
    @ApiResponse(responseCode = "200", description = "Pedido creado exitosamente")
    public ResponseEntity<PedidoServicio> crear(@Valid @RequestBody PedidoDTO pedidoDTO) {
        // Mapear DTO a entidad
        PedidoServicio pedido = new PedidoServicio();

        // Obtener la empresa cliente
        EmpresaCliente empresa = empresaClienteService.obtenerPorId(pedidoDTO.getClienteId())
            .orElseThrow(() -> new RuntimeException("Empresa cliente no encontrada con ID: " + pedidoDTO.getClienteId()));

        pedido.setEmpresaCliente(empresa);
        pedido.setFechaEntrega(pedidoDTO.getFechaEntrega());
        pedido.setDescripcion(pedidoDTO.getNotas() != null ? pedidoDTO.getNotas() : pedidoDTO.getReferencia());
        pedido.setEstado(Estado.PENDIENTE);
        pedido.setPrioridad(Prioridad.MEDIA);

        PedidoServicio pedidoCreado = pedidoServicioService.crearPedido(pedido);

        // Crear detalle del pedido con referencia y cantidad
        DetallePedido detalle = new DetallePedido();
        detalle.setPedidoServicio(pedidoCreado);
        detalle.setDescripcion(pedidoDTO.getReferencia());
        detalle.setCantidad(pedidoDTO.getCantidad());

        pedidoServicioService.agregarDetallePedido(detalle);

        return ResponseEntity.ok(pedidoCreado);
    }
    
    @GetMapping
    @Operation(summary = "Listar todos los pedidos", description = "Obtiene la lista de todos los pedidos")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    public ResponseEntity<List<PedidoServicio>> obtenerTodos() {
        return ResponseEntity.ok(pedidoServicioService.obtenerTodos());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido por ID", description = "Obtiene los detalles de un pedido específico")
    @ApiResponse(responseCode = "200", description = "Pedido encontrado")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    public ResponseEntity<PedidoServicio> obtenerPorId(@PathVariable Long id) {
        return pedidoServicioService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar pedidos por estado", description = "Obtiene pedidos filtrados por estado")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<PedidoServicio>> obtenerPorEstado(@PathVariable Estado estado) {
        return ResponseEntity.ok(pedidoServicioService.obtenerPorEstado(estado));
    }
    
    @GetMapping("/prioridad/{prioridad}")
    @Operation(summary = "Listar pedidos por prioridad", description = "Obtiene pedidos filtrados por prioridad")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<PedidoServicio>> obtenerPorPrioridad(@PathVariable Prioridad prioridad) {
        return ResponseEntity.ok(pedidoServicioService.obtenerPorPrioridad(prioridad));
    }
    
    @GetMapping("/empresa/{empresaId}")
    @Operation(summary = "Listar pedidos de una empresa", description = "Obtiene todos los pedidos de una empresa específica")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<PedidoServicio>> obtenerPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(pedidoServicioService.obtenerPorEmpresa(empresaId));
    }
    
    @PutMapping("/{id}/estado/{estado}")
    @Operation(summary = "Cambiar estado del pedido", description = "Actualiza el estado de un pedido")
    @ApiResponse(responseCode = "200", description = "Estado actualizado")
    public ResponseEntity<PedidoServicio> actualizarEstado(@PathVariable Long id, @PathVariable Estado estado) {
        return ResponseEntity.ok(pedidoServicioService.actualizarEstado(id, estado));
    }
    
    @PutMapping("/{id}/prioridad/{prioridad}")
    @Operation(summary = "Cambiar prioridad del pedido", description = "Actualiza la prioridad de un pedido")
    @ApiResponse(responseCode = "200", description = "Prioridad actualizada")
    public ResponseEntity<PedidoServicio> actualizarPrioridad(@PathVariable Long id, @PathVariable Prioridad prioridad) {
        return ResponseEntity.ok(pedidoServicioService.actualizarPrioridad(id, prioridad));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar pedido", description = "Elimina un pedido del sistema")
    @ApiResponse(responseCode = "204", description = "Pedido eliminado")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoServicioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{pedidoId}/detalles")
    @Operation(summary = "Obtener detalles del pedido", description = "Obtiene todas las líneas de un pedido")
    @ApiResponse(responseCode = "200", description = "Detalles obtenidos")
    public ResponseEntity<List<DetallePedido>> obtenerDetalles(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(pedidoServicioService.obtenerDetallesPedido(pedidoId));
    }
    
    @PostMapping("/{pedidoId}/detalles")
    @Operation(summary = "Agregar detalle al pedido", description = "Añade una nueva línea al pedido")
    @ApiResponse(responseCode = "200", description = "Detalle agregado")
    public ResponseEntity<DetallePedido> agregarDetalle(@PathVariable Long pedidoId, @RequestBody DetallePedido detalle) {
        detalle.setPedidoServicio(new PedidoServicio());
        detalle.getPedidoServicio().setId(pedidoId);
        return ResponseEntity.ok(pedidoServicioService.agregarDetallePedido(detalle));
    }
}


