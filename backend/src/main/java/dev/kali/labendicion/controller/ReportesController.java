package dev.kali.labendicion.controller;

import dev.kali.labendicion.service.ReportesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@Tag(name = "Reportes", description = "Reportes analíticos del sistema")
public class ReportesController {
    
    @Autowired
    private ReportesService reportesService;
    
    @GetMapping("/produccion")
    @Operation(summary = "Reporte de producción", description = "Obtiene estadísticas de órdenes de producción")
    @ApiResponse(responseCode = "200", description = "Reporte generado exitosamente")
    public ResponseEntity<Map<String, Object>> reporteProduccion() {
        return ResponseEntity.ok(reportesService.reporteProduccion());
    }
    
    @GetMapping("/ingresos")
    @Operation(summary = "Reporte de ingresos", description = "Obtiene estadísticas financieras y de facturación")
    @ApiResponse(responseCode = "200", description = "Reporte generado exitosamente")
    public ResponseEntity<Map<String, Object>> reporteIngresos() {
        return ResponseEntity.ok(reportesService.reporteIngresos());
    }
    
    @GetMapping("/desempen-general")
    @Operation(summary = "Reporte de desempeño general", description = "Obtiene estadísticas de desempeño de empleados")
    @ApiResponse(responseCode = "200", description = "Reporte generado exitosamente")
    public ResponseEntity<Map<String, Object>> reporteDesempenoGeneral() {
        return ResponseEntity.ok(reportesService.reporteDesempenoGeneral());
    }
}


