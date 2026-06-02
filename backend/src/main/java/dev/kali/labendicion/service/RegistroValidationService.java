package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.ProduccionRegistro;
import dev.kali.labendicion.domain.entity.Producto;
import dev.kali.labendicion.domain.entity.Registro;
import dev.kali.labendicion.repository.ProductoRepository;
import dev.kali.labendicion.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RegistroValidationService {

    @Autowired
    private ProductoRepository productoRepo;

    @Autowired
    private RegistroRepository registroRepo;

    /**
     * Valida que cada línea tenga paso asociado a la orden y que las unidades no superen
     * la cantidad de la orden por acción (acumulado histórico + nuevo registro).
     */
    public Optional<String> validarProducciones(Registro registro, String registroIdExcluir) {
        if (registro.getHoraEntrada() != null && !registro.getHoraEntrada().isBlank() &&
            registro.getHoraSalida() != null && !registro.getHoraSalida().isBlank()) {
            if (registro.getHoraSalida().compareTo(registro.getHoraEntrada()) < 0) {
                return Optional.of("La hora de salida no puede ser anterior a la hora de entrada.");
            }
        }

        if (registro.getProducciones() == null || registro.getProducciones().isEmpty()) {
            return Optional.empty();
        }

        Map<String, Integer> acumuladoExistente = calcularAcumuladoPorPaso(registroIdExcluir);

        for (ProduccionRegistro prod : registro.getProducciones()) {
            if (prod.getProductoId() == null || prod.getProductoId().isBlank()) {
                return Optional.of("Cada línea debe vincularse a una orden de producción.");
            }
            if (prod.getPasoId() == null || prod.getPasoId().isBlank()) {
                return Optional.of("Cada línea debe vincularse a una acción de la orden.");
            }

            Producto producto = productoRepo.findById(prod.getProductoId()).orElse(null);
            if (producto == null) {
                return Optional.of("La orden de producción seleccionada no existe.");
            }

            boolean pasoPertenece = producto.getPasos() != null && producto.getPasos().stream()
                    .anyMatch(p -> prod.getPasoId().equals(p.getId()));
            if (!pasoPertenece) {
                return Optional.of("La acción seleccionada no pertenece a la orden indicada.");
            }

            int cantidadOrden = producto.getCantidad() == null ? 0 : producto.getCantidad();
            int unidades = prod.getUnidadesTotales() == null ? 0 : prod.getUnidadesTotales();
            if (unidades <= 0) {
                return Optional.of("Las unidades confeccionadas deben ser mayores a cero.");
            }
            if (prod.getUnidadesBuenas() != null && prod.getUnidadesBuenas() > unidades) {
                return Optional.of("Las unidades con calidad no pueden superar las confeccionadas.");
            }

            String clave = prod.getProductoId() + ":" + prod.getPasoId();
            int yaRegistrado = acumuladoExistente.getOrDefault(clave, 0);
            if (yaRegistrado + unidades > cantidadOrden) {
                int disponible = Math.max(0, cantidadOrden - yaRegistrado);
                return Optional.of("Para esta acción solo quedan " + disponible + " unidades disponibles de " + cantidadOrden + " (meta de la orden).");
            }
            acumuladoExistente.put(clave, yaRegistrado + unidades);
        }

        return Optional.empty();
    }

    private Map<String, Integer> calcularAcumuladoPorPaso(String registroIdExcluir) {
        Map<String, Integer> acumulado = new HashMap<>();
        for (Registro r : registroRepo.findAllWithProduccionesOrderByFechaDesc()) {
            if (registroIdExcluir != null && registroIdExcluir.equals(r.getId())) continue;
            if (r.getProducciones() == null) continue;
            for (ProduccionRegistro p : r.getProducciones()) {
                if (p.getProductoId() == null || p.getPasoId() == null) continue;
                String clave = p.getProductoId() + ":" + p.getPasoId();
                int u = p.getUnidadesTotales() == null ? 0 : p.getUnidadesTotales();
                acumulado.merge(clave, u, Integer::sum);
            }
        }
        return acumulado;
    }
}
