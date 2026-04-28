package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.Factura;
import dev.kali.labendicion.domain.entity.EmpresaCliente;
import dev.kali.labendicion.domain.entity.PedidoServicio;
import dev.kali.labendicion.domain.dto.FacturaDTO;
import dev.kali.labendicion.domain.entity.Pago;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.service.FacturacionService;
import dev.kali.labendicion.service.EmpresaClienteService;
import dev.kali.labendicion.service.PedidoServicioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/facturas")
@Tag(name = "Facturación y Pagos", description = "Gestión de facturas y registros de pago")
public class FacturacionController {
    
    @Autowired
    private FacturacionService facturacionService;
    
    @Autowired
    private EmpresaClienteService empresaClienteService;

    @Autowired
    private PedidoServicioService pedidoServicioService;

    @PostMapping
    @Operation(summary = "Crear nueva factura", description = "Crea una nueva factura para un pedido completado")
    @ApiResponse(responseCode = "200", description = "Factura creada exitosamente")
    public ResponseEntity<Factura> crear(@RequestBody FacturaDTO facturaDTO) {
        // Obtener empresa cliente
        EmpresaCliente empresa = empresaClienteService.obtenerPorId(facturaDTO.getClienteId())
            .orElseThrow(() -> new RuntimeException("Empresa cliente no encontrada"));

        // Obtener pedido servicio
        PedidoServicio pedido = pedidoServicioService.obtenerPorId(facturaDTO.getPedidoId())
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Crear factura
        Factura factura = new Factura();
        factura.setEmpresaCliente(empresa);
        factura.setPedidoServicio(pedido);
        factura.setMonto(facturaDTO.getMontoTotal().doubleValue());
        factura.setMontoPagado(0.0);
        factura.setFechaEmision(facturaDTO.getFechaEmision());
        factura.setFechaVencimiento(facturaDTO.getFechaEmision().plusDays(30));  // 30 días de vencimiento

        // Mapear estado
        try {
            Estado estado = Estado.valueOf(facturaDTO.getEstado().toUpperCase());
            factura.setEstado(estado);
        } catch (IllegalArgumentException e) {
            factura.setEstado(Estado.PENDIENTE);
        }

        return ResponseEntity.ok(facturacionService.crearFactura(factura));
    }
    
    @GetMapping
    @Operation(summary = "Listar todas las facturas", description = "Obtiene la lista de todas las facturas")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    public ResponseEntity<List<Factura>> obtenerTodas() {
        return ResponseEntity.ok(facturacionService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener factura por ID", description = "Obtiene los detalles de una factura específica")
    @ApiResponse(responseCode = "200", description = "Factura encontrada")
    @ApiResponse(responseCode = "404", description = "Factura no encontrada")
    public ResponseEntity<Factura> obtenerPorId(@PathVariable Long id) {
        return facturacionService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar facturas por estado", description = "Obtiene facturas filtradas por estado")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<Factura>> obtenerPorEstado(@PathVariable Estado estado) {
        return ResponseEntity.ok(facturacionService.obtenerPorEstado(estado));
    }
    
    @GetMapping("/empresa/{empresaId}")
    @Operation(summary = "Obtener facturas de una empresa", description = "Obtiene todas las facturas de una empresa específica")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<Factura>> obtenerPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(facturacionService.obtenerPorEmpresa(empresaId));
    }
    
    @GetMapping("/empresa/{empresaId}/pendientes")
    @Operation(summary = "Obtener facturas pendientes de una empresa", description = "Obtiene facturas sin pagar de una empresa")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<Factura>> obtenerPendientesPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(facturacionService.obtenerPendientesPorEmpresa(empresaId));
    }
    
    @GetMapping("/pedido/{pedidoId}")
    @Operation(summary = "Obtener factura de un pedido", description = "Obtiene la factura asociada a un pedido")
    @ApiResponse(responseCode = "200", description = "Factura encontrada")
    @ApiResponse(responseCode = "404", description = "Factura no encontrada")
    public ResponseEntity<Factura> obtenerPorPedido(@PathVariable Long pedidoId) {
        Factura factura = facturacionService.obtenerPorPedido(pedidoId);
        return factura != null ? ResponseEntity.ok(factura) : ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{facturaId}/pagos")
    @Operation(summary = "Registrar pago", description = "Registra un nuevo pago para una factura")
    @ApiResponse(responseCode = "200", description = "Pago registrado exitosamente")
    public ResponseEntity<Pago> registrarPago(@PathVariable Long facturaId, @RequestBody Pago pago) {
        return ResponseEntity.ok(facturacionService.registrarPago(facturaId, pago));
    }
    
    @GetMapping("/{facturaId}/pago")
    @Operation(summary = "Obtener pago de una factura", description = "Obtiene el registro de pago de una factura")
    @ApiResponse(responseCode = "200", description = "Pago encontrado")
    @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    public ResponseEntity<Pago> obtenerPago(@PathVariable Long facturaId) {
        Pago pago = facturacionService.obtenerPagoPorFactura(facturaId);
        return pago != null ? ResponseEntity.ok(pago) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar factura", description = "Elimina una factura del sistema")
    @ApiResponse(responseCode = "204", description = "Factura eliminada")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        facturacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}


