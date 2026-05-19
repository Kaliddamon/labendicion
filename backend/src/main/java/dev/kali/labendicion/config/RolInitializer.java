package dev.kali.labendicion.config;

import dev.kali.labendicion.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Inicializa los roles y permisos predeterminados cuando la aplicación inicia
 */
@Component
public class RolInitializer {
    
    @Autowired
    private RolService rolService;
    
    @EventListener(ContextRefreshedEvent.class)
    public void onApplicationReady() {
        try {
            rolService.inicializarRolesYPermisos();
        } catch (Exception e) {
            System.err.println("Error inicializando roles: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
