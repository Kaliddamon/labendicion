package dev.kali.labendicion.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Arrays;

@Component
public class CleanupRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        String base = "C:\\Users\\CRIST\\Desktop\\labendicion";
        
        String[] files = {
            "backend/src/main/java/dev/kali/labendicion/controller/AreaTrabajoController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/AseoController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/DashboardController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/EmpleadoController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/EmpresaClienteController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/EvaluacionController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/FacturacionController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/MaquinaController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/MateriaPrimaController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/OrdenProduccionController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/PedidoServicioController.java",
            "backend/src/main/java/dev/kali/labendicion/controller/ReportesController.java",
            
            "backend/src/main/java/dev/kali/labendicion/service/AreaTrabajoService.java",
            "backend/src/main/java/dev/kali/labendicion/service/AseoService.java",
            "backend/src/main/java/dev/kali/labendicion/service/EmpleadoService.java",
            "backend/src/main/java/dev/kali/labendicion/service/EmpresaClienteService.java",
            "backend/src/main/java/dev/kali/labendicion/service/EvaluacionEmpleadoService.java",
            "backend/src/main/java/dev/kali/labendicion/service/FacturacionService.java",
            "backend/src/main/java/dev/kali/labendicion/service/MaquinaService.java",
            "backend/src/main/java/dev/kali/labendicion/service/OrdenProduccionService.java",
            "backend/src/main/java/dev/kali/labendicion/service/PedidoServicioService.java",
            "backend/src/main/java/dev/kali/labendicion/service/ReportesService.java",
            
            "backend/src/main/java/dev/kali/labendicion/domain/entity/AreaTrabajo.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/AsignacionAseo.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/DetallePedido.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/Empleado.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/EmpresaCliente.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/Entrega.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/EntregadoPorEmpleado.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/EvaluacionEmpleado.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/Factura.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/MantenimientoMaquina.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/Maquina.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/MateriaPrimaRecibida.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/OrdenProduccion.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/Pago.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/PedidoServicio.java",
            "backend/src/main/java/dev/kali/labendicion/domain/entity/TareaAseo.java",
            
            "backend/src/main/java/dev/kali/labendicion/repository/AreaTrabajoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/AsignacionAseoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/DetallePedidoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/EmpleadoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/EmpresaClienteRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/EntregaRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/EntregadoPorEmpleadoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/EvaluacionEmpleadoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/FacturaRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/MantenimientoMaquinaRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/MaquinaRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/MateriaPrimaRecibidaRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/OrdenProduccionRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/PagoRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/PedidoServicioRepository.java",
            "backend/src/main/java/dev/kali/labendicion/repository/TareaAseoRepository.java",
            
            "backend/src/main/java/dev/kali/labendicion/config/CorsConfig.java",
            
            "backend/API_DOCUMENTATION.md",
            "backend/CHEAT_SHEET.md",
            "backend/DEPLOY_RAILWAY.md",
            "backend/PROJECT_SUMMARY.md",
            "backend/QUICK_START.md",
            "backend/SWAGGER_ACCESS.md",
            "backend/SWAGGER_GUIDE.md",
            
            "frontend/ATTRIBUTIONS.md",
            
            "DEPLOYMENT_CHECKLIST.md",
            "INDICES_GUIA_EJECUCION.md",
            "MIGRACION_PASOS_RELACIONAL.md",
            "OPTIMIZACION_PERFORMANCE_GUIA.md",
            "QUICK_START_PASOS.md",
            "RESUMEN_IMPLEMENTACION.md",
            "RESUMEN_OPTIMIZACION.md",
            "SOLUTION_SUMMARY.md",
            "test-performance.ps1",
            "package-lock.json",
            "delete.js",
            "DeleteFiles.java",
            "DeleteFiles.class"
        };

        for (String f : files) {
            File file = new File(base, f);
            if (file.exists()) {
                file.delete();
            }
        }
        
        String[] dirs = {
            "backend/src/main/java/dev/kali/labendicion/domain/dto",
            "backend/src/main/java/dev/kali/labendicion/domain/enums",
            "frontend/labendicion",
            "frontend/src/utils",
            "frontend/src/app/utils",
            "frontend/guidelines"
        };
        
        for (String d : dirs) {
            deleteDirectory(new File(base, d));
        }

        System.out.println("---- LIMPIEZA DE ARCHIVOS COMPLETADA ----");
    }
    
    private void deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        directoryToBeDeleted.delete();
    }
}
