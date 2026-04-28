package dev.kali.labendicion.controller;

import dev.kali.labendicion.service.PedidoServicioService;
import dev.kali.labendicion.service.FacturacionService;
import dev.kali.labendicion.domain.enums.Estado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDate;
import java.time.YearMonth;

/**
 * Controlador para obtener estadísticas del dashboard
 * Proporciona métricas generales del sistema para la página principal
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private PedidoServicioService pedidoServicioService;

    @Autowired
    private FacturacionService facturacionService;

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();

        // Pedidos activos (PENDIENTE, EN_PROCESO)
        long pedidosActivos = pedidoServicioService.obtenerTodos().stream()
            .filter(p -> p.getEstado() == Estado.PENDIENTE || p.getEstado() == Estado.EN_PROCESO)
            .count();

        // Producción semanal (último 7 días) - sumamos cantidad de detalles
        LocalDate hace7Dias = LocalDate.now().minusDays(7);
        long produccionSemanal = pedidoServicioService.obtenerTodos().stream()
            .filter(p -> p.getFechaRegistro() != null && p.getFechaRegistro().toLocalDate().isAfter(hace7Dias))
            .count();  // Contamos pedidos creados en última semana

        // Facturación del mes
        YearMonth mesActual = YearMonth.now();
        double facturacionMes = facturacionService.obtenerTodas().stream()
            .filter(f -> f.getFechaEmision() != null &&
                        YearMonth.from(f.getFechaEmision()).equals(mesActual))
            .mapToDouble(f -> f.getMonto() != null ? f.getMonto() : 0)
            .sum();

        estadisticas.put("pedidosActivos", pedidosActivos);
        estadisticas.put("produccionSemanal", produccionSemanal);
        estadisticas.put("facturacionMes", (long)facturacionMes);

        return ResponseEntity.ok(estadisticas);
    }
}


