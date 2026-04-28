package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.OrdenProduccion;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.service.OrdenProduccionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ordenes-produccion")
@Tag(name = "Órdenes de Producción", description = "Gestión de órdenes derivadas de pedidos de servicio")
public class OrdenProduccionController {
    
    @Autowired
    private OrdenProduccionService ordenProduccionService;
    
    @PostMapping
    @Operation(summary = "Crear nueva orden de producción", description = "Crea una nueva orden de producción")
    @ApiResponse(responseCode = "200", description = "Orden creada exitosamente")
    public ResponseEntity<OrdenProduccion> crear(@RequestBody OrdenProduccion orden) {
        return ResponseEntity.ok(ordenProduccionService.crearOrden(orden));
    }
    
    @GetMapping
    @Operation(summary = "Listar todas las órdenes", description = "Obtiene la lista de todas las órdenes de producción")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    public ResponseEntity<List<OrdenProduccion>> obtenerTodas() {
        return ResponseEntity.ok(ordenProduccionService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener orden por ID", description = "Obtiene los detalles de una orden específica")
    @ApiResponse(responseCode = "200", description = "Orden encontrada")
    @ApiResponse(responseCode = "404", description = "Orden no encontrada")
    public ResponseEntity<OrdenProduccion> obtenerPorId(@PathVariable Long id) {
        return ordenProduccionService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar órdenes por estado", description = "Obtiene órdenes filtradas por estado")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<OrdenProduccion>> obtenerPorEstado(@PathVariable Estado estado) {
        return ResponseEntity.ok(ordenProduccionService.obtenerPorEstado(estado));
    }
    
    @GetMapping("/pedido/{pedidoId}")
    @Operation(summary = "Obtener órdenes de un pedido", description = "Obtiene todas las órdenes de un pedido específico")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<OrdenProduccion>> obtenerPorPedido(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(ordenProduccionService.obtenerPorPedido(pedidoId));
    }
    
    @GetMapping("/area/{areaId}")
    @Operation(summary = "Obtener órdenes de un área", description = "Obtiene todas las órdenes de un área de trabajo específica")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    public ResponseEntity<List<OrdenProduccion>> obtenerPorArea(@PathVariable Long areaId) {
        return ResponseEntity.ok(ordenProduccionService.obtenerPorArea(areaId));
    }
    
    @PutMapping("/{id}/progreso/{progreso}")
    @Operation(summary = "Actualizar progreso de orden", description = "Actualiza el porcentaje de progreso (0-100) de una orden")
    @ApiResponse(responseCode = "200", description = "Progreso actualizado")
    public ResponseEntity<OrdenProduccion> actualizarProgreso(@PathVariable Long id, @PathVariable Integer progreso) {
        return ResponseEntity.ok(ordenProduccionService.actualizarProgreso(id, progreso));
    }
    
    @PutMapping("/{id}/completada")
    @Operation(summary = "Marcar orden como completada", description = "Marca una orden de producción como completada")
    @ApiResponse(responseCode = "200", description = "Orden marcada como completada")
    public ResponseEntity<OrdenProduccion> marcarCompletada(@PathVariable Long id) {
        return ResponseEntity.ok(ordenProduccionService.marcarCompletada(id));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar orden", description = "Elimina una orden del sistema")
    @ApiResponse(responseCode = "204", description = "Orden eliminada")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ordenProduccionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}


