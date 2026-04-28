# 📚 GUÍA DE SWAGGER/OPENAPI - La Bendición

## Acceso a Swagger UI

Una vez que la aplicación esté ejecutándose, puedes acceder a Swagger UI en:

```
http://localhost:8080/swagger-ui.html
```

## Características de Swagger UI

### ✅ Visualizar todos los endpoints
- Todos los controladores están organizados por **tags** (categorías)
- Puedes expandir cada endpoint para ver:
  - **Descripción** detallada de qué hace
  - **Parámetros** requeridos y opcionales
  - **Tipos de respuesta** (200, 404, etc.)
  - **Esquemas** de entrada y salida (JSON)

### ✅ Testear endpoints directamente
- Haz clic en "Try it out" en cualquier endpoint
- Completa los parámetros
- Haz clic en "Execute"
- Ver la respuesta en tiempo real

### ✅ Ver la especificación OpenAPI
- La especificación JSON está disponible en:
  ```
  http://localhost:8080/api-docs
  ```
- Formato YAML está disponible en:
  ```
  http://localhost:8080/api-docs.yaml
  ```

---

## 📂 CATEGORÍAS DE ENDPOINTS

### 1. **Empresas Clientes**
- Gestión de empresas que contratan servicios
- Endpoints: crear, listar, obtener, actualizar, eliminar, buscar por NIT

### 2. **Empleados**
- Gestión de personal
- Endpoints: crear, listar, filtrar por cargo/turno, obtener activos, actualizar, eliminar

### 3. **Áreas de Trabajo**
- Gestión de espacios de producción
- Endpoints: crear, listar, filtrar activas, actualizar, eliminar

### 4. **Pedidos de Servicio**
- Solicitudes de confección
- Endpoints: crear, listar, filtrar por estado/prioridad/empresa, cambiar estado, gestionar detalles

### 5. **Órdenes de Producción**
- Órdenes generadas desde pedidos
- Endpoints: crear, listar, actualizar progreso, marcar completada, filtrar

### 6. **Facturación y Pagos**
- Emisión de facturas y registro de pagos
- Endpoints: crear factura, listar, registrar pagos, filtrar por estado

### 7. **Aseo/Limpieza**
- Asignaciones y tareas de limpieza
- Endpoints: crear asignaciones, gestionar tareas, marcar completadas

### 8. **Evaluaciones de Empleados**
- Evaluación de desempeño
- Endpoints: crear, listar, calcular promedios

### 9. **Máquinas**
- Gestión de equipamiento
- Endpoints: crear, listar, registrar mantenimientos, filtrar

### 10. **Materias Primas**
- Registro de insumos recibidos
- Endpoints: crear, listar, filtrar por tipo/empresa

### 11. **Reportes**
- Reportes analíticos
- Endpoints: reporte de producción, ingresos, desempeño general

---

## 🧪 EJEMPLOS DE PRUEBA

### 1. Crear una Empresa
1. Abre Swagger UI
2. Busca "Empresas Clientes" → POST /api/empresas
3. Haz clic en "Try it out"
4. Completa el JSON:
```json
{
  "nombre": "Textiles Andinos S.A.",
  "email": "contacto@textiles.com",
  "telefono": "3001234567",
  "direccion": "Cra 10 #20-50",
  "nit": "900123456-7",
  "contactoPersona": "Juan Pérez"
}
```
5. Haz clic en "Execute"

### 2. Crear un Empleado
1. POST /api/empleados
2. Completa:
```json
{
  "nombre": "Carlos",
  "apellido": "Gómez",
  "numeroIdentificacion": "1234567890",
  "email": "carlos@labendicion.com",
  "telefono": "3005555555",
  "cargo": "CONFECCIONISTA",
  "turno": "MAÑANA",
  "salario": 1200000
}
```

### 3. Crear un Área de Trabajo
1. POST /api/areas-trabajo
2. Completa:
```json
{
  "nombre": "Área de Corte",
  "descripcion": "Zona donde se corta el material",
  "activa": true
}
```

### 4. Crear un Pedido
1. POST /api/pedidos
2. Completa (necesitas empresa creada primero):
```json
{
  "empresaCliente": {
    "id": 1
  },
  "prioridad": "ALTA",
  "fechaEntrega": "2026-04-15",
  "descripcion": "Confección de 50 fundas de almohada"
}
```

---

## 🔍 FILTRADOS Y BÚSQUEDAS

Muchos endpoints permiten filtrar:
- **Por estado**: GET /api/pedidos/estado/PENDIENTE
- **Por prioridad**: GET /api/pedidos/prioridad/ALTA
- **Por empresa**: GET /api/pedidos/empresa/1
- **Por turno**: GET /api/empleados/turno/MAÑANA
- **Por cargo**: GET /api/empleados/cargo/CONFECCIONISTA

---

## 📊 REPORTES

Accede a reportes en:

```
GET /api/reportes/produccion    → Estadísticas de órdenes
GET /api/reportes/ingresos      → Estadísticas financieras
GET /api/reportes/desempen-general → Desempeño de empleados
```

---

## 🛠️ HERRAMIENTAS ALTERNATIVAS

Si prefieres no usar Swagger UI, puedes usar:

### Postman
1. Importa la colección desde: `http://localhost:8080/api-docs`
2. Crea solicitudes manualmente

### cURL
```bash
curl -X POST http://localhost:8080/api/empresas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mi Empresa","email":"empresa@example.com"}'
```

### Thunder Client (VS Code)
1. Instala la extensión
2. Importa desde: `http://localhost:8080/api-docs`

---

## 💡 CONSEJOS

- **Ordena por método HTTP**: En swagger, los GET están arriba, POST, PUT, DELETE abajo
- **Lee las descripciones**: Cada endpoint tiene descripción de qué hace
- **Valida antes de enviar**: Swagger muestra validaciones requeridas
- **Respuestas de error**: Verifica los códigos HTTP (200, 404, 400, etc.)
- **Schemas**: Haz clic en "Model Schema" para ver la estructura esperada

---

## 🚀 FLUJO RECOMENDADO PARA PROBAR

1. **Crear Área de Trabajo** → POST /api/areas-trabajo
2. **Crear Empresa Cliente** → POST /api/empresas
3. **Crear Empleados** → POST /api/empleados
4. **Crear Máquinas** → POST /api/maquinas
5. **Crear Pedido** → POST /api/pedidos
6. **Crear Orden de Producción** → POST /api/ordenes-produccion
7. **Actualizar Progreso** → PUT /api/ordenes-produccion/{id}/progreso/{progreso}
8. **Marcar Completada** → PUT /api/ordenes-produccion/{id}/completada
9. **Crear Factura** → POST /api/facturas
10. **Registrar Pago** → POST /api/facturas/{id}/pagos

---

## ❓ TROUBLESHOOTING

**Problema**: No puedo ver Swagger UI
**Solución**: Verifica que la aplicación está en http://localhost:8080

**Problema**: Error 404 en un endpoint
**Solución**: Verifica el ID del recurso existe

**Problema**: Error 400 en crear recurso
**Solución**: Verifica que cumples con validaciones (campos obligatorios, formatos, etc.)

**Problema**: Error 500
**Solución**: Revisa los logs de la aplicación

---

¡Enjoy testing! 🎉


