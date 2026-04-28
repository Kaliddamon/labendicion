package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.EmpresaCliente;
import dev.kali.labendicion.domain.dto.ClienteDTO;
import dev.kali.labendicion.service.EmpresaClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@Tag(name = "Empresas Clientes", description = "Gestión de empresas clientes que contratan servicios")
public class EmpresaClienteController {
    
    @Autowired
    private EmpresaClienteService empresaClienteService;
    
    @PostMapping
    @Operation(summary = "Crear nueva empresa", description = "Crea una nueva empresa cliente en el sistema")
    @ApiResponse(responseCode = "200", description = "Empresa creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    public ResponseEntity<EmpresaCliente> crear(@Valid @RequestBody ClienteDTO clienteDTO) {
        EmpresaCliente empresa = new EmpresaCliente();
        empresa.setNombre(clienteDTO.getNombre());
        empresa.setEmail(clienteDTO.getEmail());
        empresa.setTelefono(clienteDTO.getTelefono());
        empresa.setDireccion(clienteDTO.getDireccion());
        empresa.setNit(clienteDTO.getDocumento());  // Mapeo de documento → nit

        return ResponseEntity.ok(empresaClienteService.crearEmpresa(empresa));
    }
    
    @GetMapping
    @Operation(summary = "Listar todas las empresas", description = "Obtiene la lista completa de empresas registradas")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    public ResponseEntity<List<EmpresaCliente>> obtenerTodas() {
        return ResponseEntity.ok(empresaClienteService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener empresa por ID", description = "Obtiene los detalles de una empresa específica")
    @ApiResponse(responseCode = "200", description = "Empresa encontrada")
    @ApiResponse(responseCode = "404", description = "Empresa no encontrada")
    public ResponseEntity<EmpresaCliente> obtenerPorId(@PathVariable Long id) {
        return empresaClienteService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar empresa", description = "Actualiza los datos de una empresa existente")
    @ApiResponse(responseCode = "200", description = "Empresa actualizada")
    @ApiResponse(responseCode = "404", description = "Empresa no encontrada")
    public ResponseEntity<EmpresaCliente> actualizar(@PathVariable Long id, @Valid @RequestBody EmpresaCliente empresa) {
        return ResponseEntity.ok(empresaClienteService.actualizar(id, empresa));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar empresa", description = "Elimina una empresa del sistema")
    @ApiResponse(responseCode = "204", description = "Empresa eliminada")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        empresaClienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/nit/{nit}")
    @Operation(summary = "Buscar empresa por NIT", description = "Busca una empresa por su número de identificación tributaria")
    @ApiResponse(responseCode = "200", description = "Empresa encontrada")
    @ApiResponse(responseCode = "404", description = "Empresa no encontrada")
    public ResponseEntity<EmpresaCliente> obtenerPorNit(@PathVariable String nit) {
        return empresaClienteService.obtenerPorNit(nit)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}


