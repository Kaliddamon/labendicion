package dev.kali.labendicion.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

    // Redirigir todas las peticiones que no sean para la API ni recursos estáticos al index.html de React/Vite.
    // Esto soluciona el problema de recargar la página o acceder directamente a una ruta de React
    // y recibir un error 404 (Whitelabel Error Page).
    @RequestMapping(value = {
            "/{path:[^\\.]*}", 
            "/*/{path:[^\\.]*}", 
            "/*/*/{path:[^\\.]*}" 
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
