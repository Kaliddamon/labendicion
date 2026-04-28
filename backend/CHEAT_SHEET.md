# 🎯 TARJETA DE REFERENCIA RÁPIDA

## ⚡ ACCESO RÁPIDO

### PASO 1: Ejecutar
```bash
mvn spring-boot:run
```

### PASO 2: Abrir
```
http://localhost:8080/swagger-ui.html
```

### PASO 3: ¡Testear!
Haz clic en cualquier endpoint → Try it out → Execute

---

## 📍 URLS PRINCIPALES

| URL | Uso |
|-----|-----|
| http://localhost:8080/swagger-ui.html | **Swagger UI** 👈 USA ESTA |
| http://localhost:8080/api-docs | Especificación JSON |
| http://localhost:8080/h2-console | Base de datos |

---

## 🧪 CATEGORÍAS DE ENDPOINTS

| Categoría | Ruta | Docs |
|-----------|------|------|
| Empresas | `/api/empresas` | ✅ |
| Pedidos | `/api/pedidos` | ✅ |
| Órdenes | `/api/ordenes-produccion` | ✅ |
| Facturas | `/api/facturas` | ✅ |
| Reportes | `/api/reportes` | ✅ |
| Empleados | `/api/empleados` | ⏳ |
| Aseo | `/api/aseo` | ⏳ |
| Evaluaciones | `/api/evaluaciones` | ⏳ |
| Máquinas | `/api/maquinas` | ⏳ |
| Materias | `/api/materias-primas` | ⏳ |

---

## 📋 OPERACIONES BÁSICAS

```
GET     /api/recurso           → Listar
POST    /api/recurso           → Crear
GET     /api/recurso/{id}      → Obtener
PUT     /api/recurso/{id}      → Actualizar
DELETE  /api/recurso/{id}      → Eliminar
```

---

## 🔍 FILTRADOS

```
/api/pedidos/estado/PENDIENTE
/api/pedidos/empresa/1
/api/empleados/turno/MAÑANA
/api/empleados/cargo/CONFECCIONISTA
/api/facturas/estado/PENDIENTE
```

---

## 🧪 EJEMPLO: CREAR EMPRESA

**En Swagger:**
1. POST /api/empresas
2. Try it out
3. Completa:
```json
{
  "nombre": "Mi Empresa",
  "email": "empresa@example.com",
  "nit": "900123456-7"
}
```
4. Execute

---

## ✅ CHECKLIST

- [ ] Ejecuté `mvn spring-boot:run`
- [ ] Abrí http://localhost:8080/swagger-ui.html
- [ ] Probé un endpoint
- [ ] Creé datos de prueba
- [ ] Exploré filtrados
- [ ] Generé reportes

---

## 📞 DOCUMENTACIÓN

| Archivo | Cuándo leer |
|---------|------------|
| SWAGGER_ACCESS.md | Si no encuentras Swagger |
| QUICK_START.md | Para primeros pasos |
| SWAGGER_GUIDE.md | Para ejemplos |
| API_DOCUMENTATION.md | Para detalles técnicos |
| README.md | Para índice general |

---

## 🆘 ERRORES

| Error | Solución |
|-------|----------|
| "Cannot GET" | Verifica que ejecutaste `mvn spring-boot:run` |
| 404 Not Found | El ID no existe, verifica |
| 400 Bad Request | Datos inválidos, revisa Swagger |
| 500 Server Error | Error de BD, revisa logs |

---

## 💻 COMANDOS ÚTILES

```bash
# Ejecutar
mvn spring-boot:run

# Compilar
mvn clean compile

# Instalar dependencias
mvn clean install

# Salir
Ctrl + C
```

---

## 🎯 FLUJO BÁSICO

```
1. Crear Área
   ↓
2. Crear Empresa
   ↓
3. Crear Empleados
   ↓
4. Crear Pedido
   ↓
5. Crear Orden
   ↓
6. Completar Orden
   ↓
7. Crear Factura
   ↓
8. Registrar Pago
```

---

## 📊 ESTADÍSTICAS

- 100+ endpoints
- 15 entidades
- 8 enumerados
- 9 servicios
- 11 controladores
- 15 repositorios

---

## ¿QUÉ PUEDO HACER?

✅ Crear empresas
✅ Crear empleados
✅ Crear pedidos
✅ Crear órdenes
✅ Crear facturas
✅ Registrar pagos
✅ Ver reportes
✅ Hacer evaluaciones
✅ Gestionar aseo
✅ Registrar máquinas

---

## 🎁 BONIFICACIONES

✅ H2 Database (incluida)
✅ PostgreSQL (configurada)
✅ Validaciones automáticas
✅ Reportes analíticos
✅ OpenAPI estándar
✅ Swagger UI interactivo

---

## 🚀 ¡YA ESTÁ LISTO!

Ejecuta:
```bash
mvn spring-boot:run
```

Abre:
```
http://localhost:8080/swagger-ui.html
```

¡Comienza a testear! 🎉

---

**Versión**: 0.0.1
**Estado**: ✅ Funcional
**Última actualización**: 2026-04-02

