# 🚀 GUÍA RÁPIDA - La Bendición Sistema de Gestión Textil

## ✅ INSTALACIÓN Y EJECUCIÓN

### Requisitos
- Java 17+
- Maven 3.6+

### Pasos para ejecutar

```bash
# 1. Clonar o descargar el proyecto
cd labendicion

# 2. Compilar y descargar dependencias
mvn clean install

# 3. Ejecutar la aplicación
mvn spring-boot:run
```

### La aplicación estará disponible en:
- **API REST**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html ⭐
- **API Docs JSON**: http://localhost:8080/api-docs
- **H2 Console**: http://localhost:8080/h2-console

---

## 📚 ACCEDER A SWAGGER (LO MÁS IMPORTANTE)

Una vez que la aplicación esté ejecutándose:

1. **Abre tu navegador**
2. **Ve a**: http://localhost:8080/swagger-ui.html
3. **Verás todos los endpoints organizados por categorías**
4. **Haz clic en cualquier endpoint para ver detalles**
5. **Usa "Try it out" para probar sin código extra**

### ¿Qué puedo hacer en Swagger?
✅ Ver documentación de todos los endpoints
✅ Probar cada endpoint sin escribir código
✅ Ver ejemplos de solicitudes y respuestas
✅ Ver códigos de error esperados
✅ Descargar la especificación OpenAPI (JSON/YAML)

---

## 🎯 CATEGORÍAS DE ENDPOINTS

| Categoría | Descripción | Rutas |
|-----------|-------------|-------|
| **Empresas Clientes** | Gestión de clientes | `/api/empresas` |
| **Empleados** | Gestión de personal | `/api/empleados` |
| **Áreas de Trabajo** | Espacios de producción | `/api/areas-trabajo` |
| **Pedidos** | Solicitudes de confección | `/api/pedidos` |
| **Órdenes Producción** | Órdenes de trabajo | `/api/ordenes-produccion` |
| **Facturas** | Facturación y pagos | `/api/facturas` |
| **Aseo** | Limpieza e higiene | `/api/aseo` |
| **Evaluaciones** | Desempeño empleados | `/api/evaluaciones` |
| **Máquinas** | Equipamiento | `/api/maquinas` |
| **Materias Primas** | Insumos recibidos | `/api/materias-primas` |
| **Reportes** | Analytics | `/api/reportes` |

---

## 🧪 PRIMER TEST - CREAR EMPRESA

1. Abre http://localhost:8080/swagger-ui.html
2. Busca **"Empresas Clientes"** → expande la sección
3. Haz clic en **POST /api/empresas**
4. Haz clic en **"Try it out"**
5. Completa con este JSON:
```json
{
  "nombre": "Mi Primera Empresa",
  "email": "empresa@example.com",
  "telefono": "3001234567",
  "direccion": "Cra 1 #1-1",
  "nit": "900123456-7",
  "contactoPersona": "Juan Pérez"
}
```
6. Haz clic en **"Execute"**
7. ¡Ver respuesta exitosa! ✅

---

## 🔄 FLUJO BÁSICO DE PRUEBA

```
1. Crear Área de Trabajo
   ↓
2. Crear Empresa Cliente
   ↓
3. Crear Empleados
   ↓
4. Crear Pedido de Servicio
   ↓
5. Crear Orden de Producción
   ↓
6. Actualizar Progreso
   ↓
7. Marcar como Completada
   ↓
8. Crear Factura
   ↓
9. Registrar Pago
```

---

## 📋 BASE DE DATOS

### Desarrollo (automático)
- **BD**: H2 en memoria
- **Console**: http://localhost:8080/h2-console
- **User**: sa
- **Password**: (vacío)

### Producción (opcional)
Para cambiar a PostgreSQL:
1. Edita `application.properties`
2. Descomenta las líneas de PostgreSQL
3. Crea la BD en PostgreSQL
4. Reinicia la aplicación

---

## 🛑 VALIDACIONES BÁSICAS

### Empresas
- ✅ Nombre obligatorio
- ✅ Email válido (formato)
- ✅ NIT único en el sistema

### Empleados
- ✅ Nombre y apellido obligatorio
- ✅ Número de ID único
- ✅ Cargo válido (enum)
- ✅ Turno válido (enum)

### Pedidos
- ✅ Empresa cliente debe existir
- ✅ Fecha de entrega >= hoy
- ✅ Prioridad válida

### Facturas
- ✅ Monto > 0
- ✅ Pedido debe estar completado
- ✅ Una factura por pedido

---

## 🔍 FILTRADOS ÚTILES

```
GET /api/pedidos/estado/PENDIENTE          → Pedidos pendientes
GET /api/pedidos/empresa/1                 → Pedidos de empresa ID 1
GET /api/empleados/turno/MAÑANA            → Empleados turno mañana
GET /api/empleados/cargo/CONFECCIONISTA    → Por cargo
GET /api/facturas/estado/PENDIENTE         → Facturas sin pagar
```

---

## 📊 REPORTES

Accede desde Swagger en `/api/reportes`:

- **Producción** → Estadísticas de órdenes
- **Ingresos** → Facturación total, pagado, pendiente
- **Desempeño** → Promedio general de empleados

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| 404 | Recurso no encontrado | Verifica el ID existe |
| 400 | Datos inválidos | Revisa validaciones (campos obligatorios) |
| 500 | Error del servidor | Revisa logs de la aplicación |
| Swagger no carga | Puerto ocupado | Intenta otro puerto en application.properties |

---

## 📞 DOCUMENTACIÓN ADICIONAL

- **API_DOCUMENTATION.md** → Detalle técnico completo
- **SWAGGER_GUIDE.md** → Guía detallada de Swagger
- **HELP.md** → Información de Spring Boot

---

## 🎉 ¡LISTO!

Ahora puedes:
1. ✅ Ejecutar `mvn spring-boot:run`
2. ✅ Abrir http://localhost:8080/swagger-ui.html
3. ✅ Comenzar a probar endpoints
4. ✅ Crear datos de prueba
5. ✅ Explorar toda la API

**No necesitas escribir código, Swagger hace todo por ti** 🚀


