package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.OrdenProduccion;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.repository.OrdenProduccionRepository;
import dev.kali.labendicion.repository.FacturaRepository;
import dev.kali.labendicion.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportesService {
    
    @Autowired
    private OrdenProduccionRepository ordenProduccionRepository;
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    @Autowired
    private EmpleadoRepository empleadoRepository;
    
    @Autowired
    private EvaluacionEmpleadoService evaluacionService;
    
    // Reporte de producción
    public Map<String, Object> reporteProduccion() {
        Map<String, Object> reporte = new HashMap<>();
        
        List<OrdenProduccion> ordenesPendientes = ordenProduccionRepository.findByEstado(Estado.PENDIENTE);
        List<OrdenProduccion> ordenesEnProceso = ordenProduccionRepository.findByEstado(Estado.EN_PROCESO);
        List<OrdenProduccion> ordenesCompletadas = ordenProduccionRepository.findByEstado(Estado.COMPLETADO);
        
        reporte.put("pendientes", ordenesPendientes.size());
        reporte.put("enProceso", ordenesEnProceso.size());
        reporte.put("completadas", ordenesCompletadas.size());
        reporte.put("total", ordenProduccionRepository.findAll().size());
        
        Double progresoPromedio = ordenProduccionRepository.findAll().stream()
            .mapToInt(o -> o.getProgreso() != null ? o.getProgreso() : 0)
            .average()
            .orElse(0.0);
        
        reporte.put("progresoPromedio", progresoPromedio);
        
        return reporte;
    }
    
    // Reporte de ingresos
    public Map<String, Object> reporteIngresos() {
        Map<String, Object> reporte = new HashMap<>();
        
        Double ingresoTotal = facturaRepository.findAll().stream()
            .mapToDouble(f -> f.getMonto() != null ? f.getMonto() : 0)
            .sum();
        
        Double montoPagado = facturaRepository.findAll().stream()
            .mapToDouble(f -> f.getMontoPagado() != null ? f.getMontoPagado() : 0)
            .sum();
        
        reporte.put("ingresoTotal", ingresoTotal);
        reporte.put("montoPagado", montoPagado);
        reporte.put("saldoPendiente", ingresoTotal - montoPagado);
        reporte.put("facturasEmitidas", facturaRepository.findAll().size());
        reporte.put("facturasPagadas", facturaRepository.findByEstado(Estado.COMPLETADO).size());
        reporte.put("facturasPendientes", facturaRepository.findByEstado(Estado.PENDIENTE).size());
        
        return reporte;
    }
    
    // Reporte de desempeño general
    public Map<String, Object> reporteDesempenoGeneral() {
        Map<String, Object> reporte = new HashMap<>();
        
        Double promedioGeneral = evaluacionService.calcularPromedioGeneral();
        Long empleadosActivos = empleadoRepository.findByActivo(true).stream().count();
        
        reporte.put("promedioDesempenoGeneral", promedioGeneral);
        reporte.put("empleadosActivos", empleadosActivos);
        reporte.put("empleadosTotal", empleadoRepository.findAll().size());
        
        return reporte;
    }
}

