package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.ProductoSync;
import dev.kali.labendicion.domain.entity.RegistroSync;
import dev.kali.labendicion.domain.entity.Usuario;
import dev.kali.labendicion.repository.ProductoSyncRepository;
import dev.kali.labendicion.repository.RegistroSyncRepository;
import dev.kali.labendicion.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AlertaEmailService {

    @Autowired
    private ResendEmailService resendEmailService;

    @Autowired
    private RegistroSyncRepository registroRepo;

    @Autowired
    private ProductoSyncRepository productoRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    private static final int HORAS_PLAN_DIA = 9;
    private static final int META_UNIDADES_HORA = 12;

    // Ejecuta todos los días a las 4:00 PM (Hora Colombia)
    @Scheduled(cron = "0 0 16 * * ?", zone = "America/Bogota")
    public void evaluarYEnviarAlertas() {
        log.info("Evaluando alertas de rendimiento al final del turno...");
        
        String hoy = LocalDate.now(ZoneId.of("America/Bogota")).toString();
        List<RegistroSync> registrosHoy = registroRepo.findByFecha(hoy);
        List<ProductoSync> todosProductos = productoRepo.findAll();
        
        if (registrosHoy.isEmpty()) {
            log.info("No hay registros hoy, no se evalúan alertas operativas.");
            return;
        }

        double totalTotales = 0;
        double totalBuenas = 0;
        double horasAsistidas = 0;

        for (RegistroSync r : registrosHoy) {
            totalTotales += (r.getUnidadesTotales() != null) ? r.getUnidadesTotales() : 0;
            totalBuenas += (r.getUnidadesBuenas() != null) ? r.getUnidadesBuenas() : 0;
            horasAsistidas += calcularHorasTrabajadas(r.getHoraEntrada(), r.getHoraSalida());
        }

        double defectos = Math.max(totalTotales - totalBuenas, 0);
        double horasPlanificadas = registrosHoy.size() * HORAS_PLAN_DIA;
        
        double eficiencia = horasAsistidas > 0 ? (totalBuenas / horasAsistidas / META_UNIDADES_HORA) * 100 : 0;
        double defectosRate = totalTotales > 0 ? (defectos / totalTotales) * 100 : 0;
        double ausentismo = horasPlanificadas > 0 ? ((horasPlanificadas - horasAsistidas) / horasPlanificadas) * 100 : 0;

        // OTD (Cumplimiento Despacho)
        List<ProductoSync> conVencimiento = todosProductos.stream()
                .filter(p -> p.getFechaTerminacion() != null && p.getFechaTerminacion().compareTo(hoy) <= 0)
                .collect(Collectors.toList());
        
        long terminados = conVencimiento.stream()
                .filter(p -> "Terminado".equalsIgnoreCase(p.getEstado()))
                .count();

        double otd = conVencimiento.isEmpty() ? 100 : ((double) terminados / conVencimiento.size()) * 100;

        // Evaluar umbrales
        String estEficiencia = getEstadoByThreshold(eficiencia, 90, 80);
        String estDefectos = getEstadoByThresholdInverse(defectosRate, 3, 5);
        String estOtd = getEstadoByThreshold(otd, 95, 90);
        String estAusentismo = getEstadoByThresholdInverse(ausentismo, 5, 10);

        boolean hayRiesgos = !estEficiencia.equals("verde") || !estDefectos.equals("verde") 
                          || !estOtd.equals("verde") || !estAusentismo.equals("verde");

        if (hayRiesgos) {
            enviarCorreo(hoy, eficiencia, defectosRate, otd, ausentismo, 
                         estEficiencia, estDefectos, estOtd, estAusentismo);
        } else {
            log.info("No hay alertas críticas hoy. Todos los indicadores están en verde.");
        }
    }

    private double calcularHorasTrabajadas(String entrada, String salida) {
        if (entrada == null || salida == null || !entrada.contains(":") || !salida.contains(":")) return 0;
        try {
            String[] in = entrada.split(":");
            String[] out = salida.split(":");
            int hIn = Integer.parseInt(in[0]), mIn = Integer.parseInt(in[1]);
            int hOut = Integer.parseInt(out[0]), mOut = Integer.parseInt(out[1]);
            int minutos = (hOut * 60 + mOut) - (hIn * 60 + mIn);
            return Math.max((double) minutos / 60.0, 0.0);
        } catch (Exception e) {
            return 0;
        }
    }

    private String getEstadoByThreshold(double value, double goodMin, double warnMin) {
        if (value >= goodMin) return "verde";
        if (value >= warnMin) return "amarillo";
        return "rojo";
    }

    private String getEstadoByThresholdInverse(double value, double goodMax, double warnMax) {
        if (value <= goodMax) return "verde";
        if (value <= warnMax) return "amarillo";
        return "rojo";
    }

    private void enviarCorreo(String fecha, double eficiencia, double defectosRate, double otd, double ausentismo,
                              String eEficiencia, String eDefectos, String eOtd, String eAusentismo) {
        // Obtener dinámicamente los emails de administradores y superadministradores activos
        List<String> destinatarios = usuarioRepo
                .findActiveByRolNombreIn(List.of("ADMINISTRADOR", "SUPERADMINISTRADOR"))
                .stream()
                .map(Usuario::getEmail)
                .distinct()
                .collect(Collectors.toList());

        if (destinatarios.isEmpty()) {
            log.warn("No se encontraron administradores o superadministradores activos para enviar alertas.");
            return;
        }

        log.info("Enviando alertas a {} destinatario(s): {}", destinatarios.size(), destinatarios);

        String subject = "⚠️ Reporte de Alertas Operativas del Día - " + fecha;
        String html = construirPlantillaHtml(fecha, eficiencia, defectosRate, otd, ausentismo, 
                                             eEficiencia, eDefectos, eOtd, eAusentismo);

        boolean enviado = resendEmailService.enviarCorreoHtml(destinatarios, subject, html);
        
        if (enviado) {
            log.info("Correo de alertas enviado exitosamente vía Resend.");
        } else {
            log.error("Falló el envío de correo de alertas vía Resend.");
        }
    }

    private String construirPlantillaHtml(String fecha, double eficiencia, double defectosRate, double otd, double ausentismo,
                                          String eEficiencia, String eDefectos, String eOtd, String eAusentismo) {
        return "<html><body style='font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;'>" +
               "<div style='max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>" +
               "<h2 style='color: #0f172a;'>Reporte de Alertas - " + fecha + "</h2>" +
               "<p style='color: #64748b; font-size: 14px;'>Las siguientes métricas requieren atención:</p>" +
               
               construirFila("Eficiencia Global", String.format("%.1f%%", eficiencia), eEficiencia, "Revisar balance de carga y soporte a operarios.") +
               construirFila("Tasa de Defectos", String.format("%.1f%%", defectosRate), eDefectos, "Aplicar checklist de calidad y auditar causas.") +
               construirFila("Cumplimiento Despacho (OTD)", String.format("%.1f%%", otd), eOtd, "Priorizar pedidos vencidos y reasignar capacidad.") +
               construirFila("Ausentismo", String.format("%.1f%%", ausentismo), eAusentismo, "Validar turnos, puntualidad y reemplazos.") +
               
               "</div></body></html>";
    }

    private String construirFila(String metrica, String valor, String estado, String accion) {
        if (estado.equals("verde")) return ""; // Solo enviar los que requieren atención
        
        String colorBg = estado.equals("amarillo") ? "#fef3c7" : "#ffe4e6";
        String colorTexto = estado.equals("amarillo") ? "#d97706" : "#e11d48";
        String colorBorder = estado.equals("amarillo") ? "#fde68a" : "#fecdd3";
        
        return "<div style='background-color: " + colorBg + "; border: 1px solid " + colorBorder + 
               "; border-radius: 8px; padding: 15px; margin-bottom: 15px;'>" +
               "<div style='display: flex; justify-content: space-between; font-weight: bold; color: " + colorTexto + ";'>" +
               "<span>" + metrica + "</span><span>" + valor + "</span>" +
               "</div>" +
               "<p style='margin: 8px 0 0 0; font-size: 13px; color: " + colorTexto + ";'>" + accion + "</p>" +
               "</div>";
    }
}
