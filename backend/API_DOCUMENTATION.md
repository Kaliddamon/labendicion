# LABENDICIÓN - Sistema de Gestión Textil

## 📋 Descripción
Sistema de gestión integral para una microempresa de confecciones textiles. Cubre procesos productivos, facturación, control de empleados, aseo y supervisión de desempeño.

---

## 🏗️ ARQUITECTURA DEL PROYECTO

### Capas
```
Controladores REST (Controller)
        ↓
Servicios (Service)
        ↓
Repositorios (Repository/JPA)
        ↓
Base de Datos
```

### Estructura de Paquetes
```
dev.kali.labendicion/
├── domain/
│   ├── entity/          → Entidades JPA
│   └── enums/           → Enumerados
├── repository/          → Data Access Objects
├── service/             → Lógica de negocio
├── controller/          → Endpoints REST
├── exception/           → Manejo de excepciones
└── config/              → Configuraciones
```

---

## 🗄️ ENTIDADES Y RELACIONES

### Núcleo de Negocio
- **EmpresaCliente** → Clientes que contratan servicios
- **PedidoServicio** → Solicitudes de confección
- **DetallePedido** → Desglose de líneas en pedidos
- **Prioridad** (Enum) → Prioridad del pedido

### Producción
- **OrdenProduccion** → Órdenes derivadas de pedidos
- **AreaTrabajo** → Áreas de trabajo (Corte, Confección, Empaque)
- **Maquina** → Máquinas de confección
- **MantenimientoMaquina** → Registro de mantenimientos
- **MateriaPrimaRecibida** → Insumos recibidos

### Entregas
- **Entrega** → Entrega de productos
- **EntregadoPorEmpleado** → Relación empleado-entrega (N:M)

### Facturación
- **Factura** → Documentos de cobro
- **Pago** → Registros de pagos

### Recursos Humanos
- **Empleado** → Personal de la empresa
- **Cargo** (Enum) → Cargos disponibles
- **Turno** (Enum) → Turnos de trabajo
- **EvaluacionEmpleado** → Evaluaciones de desempeño
- **AsignacionAseo** → Asignaciones de limpieza
- **TareaAseo** → Tareas específicas de aseo

### Enumerados
- **Estado** → PENDIENTE, EN_PROCESO, COMPLETADO, CANCELADO, ENTREGADO
- **Prioridad** → BAJA, MEDIA, ALTA, URGENTE
- **Cargo** → CONFECCIONISTA, CORTADOR, SUPERVISOR, JEFE_PRODUCCION, etc.
- **Turno** → MAÑANA, TARDE, NOCHE
- **TipoMaterial** → TELA, HILO, BOTONES, CIERRES, etc.
- **TipoMaquina** → OVERLOCK, RECTA, COLLARETERA, REMALLADORA, etc.
- **TipoMantenimiento** → PREVENTIVO, CORRECTIVO
- **MetodoPago** → EFECTIVO, TRANSFERENCIA, CHEQUE, TARJETA

---

## 🔌 ENDPOINTS REST

### Empresas Clientes
```
POST   /api/empresas                    → Crear empresa
GET    /api/empresas                    → Listar empresas
GET    /api/empresas/{id}               → Detalle de empresa
GET    /api/empresas/nit/{nit}          → Buscar por NIT
PUT    /api/empresas/{id}               → Actualizar
DELETE /api/empresas/{id}               → Eliminar
```

### Empleados
```
POST   /api/empleados                   → Crear empleado
GET    /api/empleados                   → Listar
GET    /api/empleados/{id}              → Detalle
GET    /api/empleados/identificacion/{nId}  → Buscar por ID
GET    /api/empleados/cargo/{cargo}     → Por cargo
GET    /api/empleados/turno/{turno}     → Por turno
GET    /api/empleados/activos           → Solo activos
PUT    /api/empleados/{id}              → Actualizar
DELETE /api/empleados/{id}              → Eliminar
```

### Áreas de Trabajo
```
POST   /api/areas-trabajo               → Crear área
GET    /api/areas-trabajo               → Listar
GET    /api/areas-trabajo/activas       → Solo activas
GET    /api/areas-trabajo/{id}          → Detalle
PUT    /api/areas-trabajo/{id}          → Actualizar
DELETE /api/areas-trabajo/{id}          → Eliminar
```

### Pedidos de Servicio
```
POST   /api/pedidos                     → Crear pedido
GET    /api/pedidos                     → Listar
GET    /api/pedidos/{id}                → Detalle
GET    /api/pedidos/estado/{estado}     → Por estado
GET    /api/pedidos/prioridad/{prioridad}  → Por prioridad
GET    /api/pedidos/empresa/{empresaId} → Por empresa
PUT    /api/pedidos/{id}/estado/{estado}     → Cambiar estado
PUT    /api/pedidos/{id}/prioridad/{prioridad} → Cambiar prioridad
GET    /api/pedidos/{pedidoId}/detalles      → Detalles
POST   /api/pedidos/{pedidoId}/detalles      → Agregar detalle
DELETE /api/pedidos/{id}                → Eliminar
```

### Órdenes de Producción
```
POST   /api/ordenes-produccion         → Crear orden
GET    /api/ordenes-produccion         → Listar
GET    /api/ordenes-produccion/{id}    → Detalle
GET    /api/ordenes-produccion/estado/{estado}  → Por estado
GET    /api/ordenes-produccion/pedido/{pedidoId}  → Por pedido
GET    /api/ordenes-produccion/area/{areaId}     → Por área
PUT    /api/ordenes-produccion/{id}/progreso/{progreso} → Actualizar progreso
PUT    /api/ordenes-produccion/{id}/completada    → Marcar completada
DELETE /api/ordenes-produccion/{id}    → Eliminar
```

### Facturas
```
POST   /api/facturas                   → Crear factura
GET    /api/facturas                   → Listar
GET    /api/facturas/{id}              → Detalle
GET    /api/facturas/estado/{estado}   → Por estado
GET    /api/facturas/empresa/{empresaId}  → Por empresa
GET    /api/facturas/empresa/{empresaId}/pendientes  → Pendientes
GET    /api/facturas/pedido/{pedidoId}    → Por pedido
POST   /api/facturas/{facturaId}/pagos    → Registrar pago
GET    /api/facturas/{facturaId}/pago     → Obtener pago
DELETE /api/facturas/{id}              → Eliminar
```

### Aseo/Limpieza
```
POST   /api/aseo/asignaciones                  → Crear asignación
GET    /api/aseo/asignaciones                  → Listar
GET    /api/aseo/asignaciones/{id}             → Detalle
GET    /api/aseo/asignaciones/empleado/{empleadoId}  → Por empleado
GET    /api/aseo/asignaciones/area/{areaId}         → Por área
GET    /api/aseo/asignaciones/turno/{turno}         → Por turno
GET    /api/aseo/asignaciones/no-completadas       → Sin completar
PUT    /api/aseo/asignaciones/{id}/completada      → Marcar completada
DELETE /api/aseo/asignaciones/{id}                  → Eliminar

POST   /api/aseo/tareas                       → Crear tarea
GET    /api/aseo/tareas/asignacion/{asignacionId}  → Tareas de asignación
PUT    /api/aseo/tareas/{tareaId}/completada      → Marcar completada
```

### Evaluaciones
```
POST   /api/evaluaciones                      → Crear evaluación
GET    /api/evaluaciones                      → Listar
GET    /api/evaluaciones/{id}                 → Detalle
GET    /api/evaluaciones/empleado/{empleadoId}    → Por empleado
GET    /api/evaluaciones/empleado/{empleadoId}/promedio  → Promedio empleado
GET    /api/evaluaciones/promedio-general    → Promedio general
DELETE /api/evaluaciones/{id}                 → Eliminar
```

### Máquinas
```
POST   /api/maquinas                          → Crear máquina
GET    /api/maquinas                          → Listar
GET    /api/maquinas/{id}                     → Detalle
GET    /api/maquinas/area/{areaId}            → Por área
GET    /api/maquinas/tipo/{tipo}              → Por tipo
GET    /api/maquinas/operativas               → Operativas
PUT    /api/maquinas/{id}/operativa/{operativa}  → Cambiar estado
DELETE /api/maquinas/{id}                     → Eliminar

POST   /api/maquinas/{maquinaId}/mantenimientos     → Registrar mantenimiento
GET    /api/maquinas/{maquinaId}/mantenimientos    → Historial
GET    /api/maquinas/mantenimientos/tipo/{tipo}    → Por tipo
```

### Materias Primas
```
POST   /api/materias-primas              → Crear registro
GET    /api/materias-primas              → Listar
GET    /api/materias-primas/{id}         → Detalle
GET    /api/materias-primas/empresa/{empresaId}  → Por empresa
GET    /api/materias-primas/tipo/{tipo}  → Por tipo
PUT    /api/materias-primas/{id}         → Actualizar
DELETE /api/materias-primas/{id}         → Eliminar
```

### Reportes
```
GET    /api/reportes/produccion         → Reporte de producción
GET    /api/reportes/ingresos           → Reporte financiero
GET    /api/reportes/desempen-general   → Reporte de desempeño
```

---

## 🗃️ CONFIGURACIÓN DE BASE DE DATOS

### Desarrollo (H2 In-Memory)
```properties
spring.datasource.url=jdbc:h2:mem:labendicion
spring.datasource.driverClassName=org.h2.Driver
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```
Accesible en: `http://localhost:8080/h2-console`

### Producción (PostgreSQL)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/labendicion
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

## 🚀 INSTALACIÓN Y EJECUCIÓN

### Requisitos
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (para producción)

### Pasos
```bash
# 1. Clonar el repositorio
git clone [url-repo]
cd labendicion

# 2. Compilar
mvn clean install

# 3. Ejecutar
mvn spring-boot:run

# La aplicación estará disponible en: http://localhost:8080
```

### Cambiar entre BD (Desarrollo a Producción)
1. Modifica `application.properties`
2. Descomentar configuración de PostgreSQL
3. Crear BD en PostgreSQL
4. Ejecutar nuevamente

---

## 📦 DEPENDENCIAS PRINCIPALES

```xml
- spring-boot-starter-web (REST APIs)
- spring-boot-starter-data-jpa (Acceso a datos)
- spring-boot-starter-validation (Validaciones)
- h2 (BD de desarrollo)
- postgresql (BD de producción)
- lombok (Anotaciones)
```

---

## ✅ VALIDACIONES

### Empresas
- ✓ Nombre obligatorio
- ✓ Email válido (si se proporciona)
- ✓ NIT único

### Empleados
- ✓ Nombre y apellido obligatorio
- ✓ Número de identificación único
- ✓ Email válido (si se proporciona)
- ✓ Cargo válido

### Pedidos
- ✓ Empresa cliente debe existir
- ✓ Fecha de entrega >= hoy
- ✓ Detalles no vacíos

### Facturas
- ✓ Monto > 0
- ✓ Pedido debe estar completado
- ✓ Una factura por pedido

---

## 🔄 FLUJOS DE NEGOCIO PRINCIPALES

### 1. Crear Pedido → Orden Producción → Entrega
1. Crear `EmpresaCliente`
2. Crear `PedidoServicio` con detalles
3. Sistema crea automáticamente `OrdenProduccion`
4. Asignar a `AreaTrabajo` y empleados
5. Actualizar progreso de producción
6. Marcar como completada
7. Crear `Entrega` y registrar empleados
8. Crear `Factura`
9. Registrar `Pago`

### 2. Gestión de Aseo
1. Crear `AsignacionAseo` (empleado + área + turno)
2. Agregar `TareaAseo`
3. Marcar tareas completadas
4. Marcar asignación completada

### 3. Evaluación de Empleados
1. Crear `EvaluacionEmpleado` con calificación
2. Calcular promedio por empleado
3. Calcular promedio general

---

## 📝 NOTAS IMPORTANTES

- Las validaciones básicas están implementadas con Jakarta Validation
- Los enumerados se almacenan como STRING en BD (facilita consultas)
- Las fechas de auditoría (createdAt, updatedAt) se generan automáticamente
- El manejador global de excepciones proporciona respuestas consistentes
- Los DTOs se crearon solo para entrada compleja de datos
- Para producción, configura PostgreSQL en `application.properties`

---

## 🎯 ADICIONALES PROPUESTOS (No en MER original)

1. **AreaTrabajo (Entidad Completa)** → Definida como entidad en lugar de solo almacenamiento, permite consultas dinámicas
2. **GlobalExceptionHandler** → Manejo centralizado de errores HTTP
3. **ReportesService** → Tres reportes útiles para el negocio
4. **Validaciones con @Valid** → Anotaciones de Jakarta Bean Validation
5. **Auditoría básica** → Campos de timestamps automáticos

---

## 📞 Soporte y Contacto
Para preguntas o sugerencias, contactar al equipo de desarrollo.


