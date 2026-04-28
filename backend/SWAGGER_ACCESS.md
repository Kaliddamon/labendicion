# 🎯 ACCESO A SWAGGER - INSTRUCCIONES PASO A PASO

## ¡LO MÁS IMPORTANTE! 👇

### **PASO 1: Ejecutar la Aplicación**

```bash
cd C:\Users\CRIST\IdeaProjects\labendicion
mvn spring-boot:run
```

Espera hasta ver algo como:
```
[INFO] Started LabendicionApplication in 5.234 seconds
```

---

## **PASO 2: Abrir Swagger UI**

### Opción 1: Copia y pega en el navegador
```
http://localhost:8080/swagger-ui.html
```

### Opción 2: Haz clic aquí (si el sistema soporta links)
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Opción 3: Navega manualmente
1. Abre tu navegador favorito (Chrome, Firefox, Edge, etc.)
2. Ve a la barra de direcciones
3. Escribe: `http://localhost:8080/swagger-ui.html`
4. Presiona Enter

---

## **PASO 3: ¡Verás la Interfaz Swagger!**

Te aparecerá una página con:
- 📋 Todas las APIs listadas
- 🔍 Organizadas por categorías (tags)
- 📝 Descripción de cada endpoint
- 🧪 Botón "Try it out" para probar

---

## 🎨 NAVEGACIÓN EN SWAGGER

### Secciones principales:

1. **Empresas Clientes** (azul)
   - POST /api/empresas → Crear
   - GET /api/empresas → Listar
   - etc.

2. **Pedidos de Servicio** (verde)
   - POST /api/pedidos → Crear
   - GET /api/pedidos → Listar
   - etc.

3. **Órdenes de Producción** (naranja)
   - POST /api/ordenes-produccion
   - GET /api/ordenes-produccion
   - etc.

4. **Facturación y Pagos** (rojo)
   - POST /api/facturas
   - GET /api/facturas
   - etc.

5. **Reportes** (púrpura)
   - GET /api/reportes/produccion
   - GET /api/reportes/ingresos
   - etc.

---

## 🧪 PRIMER TEST EN 30 SEGUNDOS

1. **Busca "Empresas Clientes"**
2. **Haz clic en POST /api/empresas**
3. **Haz clic en "Try it out"**
4. **Reemplaza el JSON con esto:**
```json
{
  "nombre": "Mi Empresa",
  "email": "empresa@example.com",
  "nit": "900123456-7"
}
```
5. **Haz clic en "Execute"**
6. **¡Verás la respuesta exitosa!** ✅

---

## 📍 OTRAS URLs ÚTILES

| URL | Descripción |
|-----|-------------|
| http://localhost:8080/swagger-ui.html | **Swagger UI (AQUÍ DEBES IR)** 👈 |
| http://localhost:8080/api-docs | API en formato JSON |
| http://localhost:8080/api-docs.yaml | API en formato YAML |
| http://localhost:8080/h2-console | Base de datos H2 |

---

## ❓ ¿QUÉ PUEDO HACER EN SWAGGER?

### ✅ SI (Lo que funciona)
- Ver todos los endpoints
- Leer la documentación
- Probar endpoints
- Ver ejemplos
- Descargar especificación
- Filtrar por tipo (GET, POST, etc.)

### ❌ NO (Lo que NO hace)
- Editar el código
- Cambiar la BD
- Crear tablas
- Ver logs

---

## 🛠️ SI NO FUNCIONA

### ❌ Error: "Cannot GET /swagger-ui.html"
**Solución**: Asegúrate que:
1. La aplicación está corriendo (`mvn spring-boot:run`)
2. Espera 3-5 segundos a que inicie
3. La URL es exacta: `http://localhost:8080/swagger-ui.html`

### ❌ Error: "Connection refused"
**Solución**:
1. Abre una terminal
2. Escribe: `mvn spring-boot:run`
3. Espera a ver "Started LabendicionApplication"
4. Luego accede a Swagger

### ❌ El navegador dice "offline"
**Solución**:
1. Verifica que escribiste bien: http (no https)
2. Verifica el puerto es 8080
3. Verifica que no hay otro programa usando el 8080

### ❌ Swagger carga pero no hay endpoints
**Solución**:
1. Espera 10 segundos más
2. Recarga la página (F5 o Ctrl+R)
3. Limpia el cache (Ctrl+Shift+Del)

---

## 💡 TIPS Y TRUCOS

### 🔍 Buscar un endpoint
1. Haz clic en el campo "Filter" (arriba)
2. Escribe "/pedidos" o lo que busques
3. Se filtran automáticamente

### 📋 Expandir/Contraer todo
1. Haz clic en "Expand all" / "Collapse all" (arriba a la derecha)

### 🔄 Ejecutar ejemplo
1. Haz clic en "Try it out"
2. Los ejemplos ya tienen datos
3. Solo haz clic en "Execute"

### 💾 Guardar configuración
Swagger guarda automáticamente tu historial

---

## 📱 DESDE EL MÓVIL

Si quieres acceder desde otra computadora en la red:

1. En la computadora con la app, abre terminal y escribe:
```bash
ipconfig
```

2. Busca tu IPv4 (algo como 192.168.x.x)

3. En el móvil/otra PC, accede a:
```
http://TU_IP:8080/swagger-ui.html
```

Ejemplo:
```
http://192.168.1.100:8080/swagger-ui.html
```

---

## ✨ ¡AHORA ESTÁS LISTO!

🎉 **Tienes una API completamente documentada e interactiva**

### Próximos pasos:
1. ✅ Ejecutar `mvn spring-boot:run`
2. ✅ Ir a http://localhost:8080/swagger-ui.html
3. ✅ Empezar a probar endpoints
4. ✅ Crear datos de prueba
5. ✅ Explorar la API completa

**¡NO NECESITAS CÓDIGO NI POSTMAN!**
Swagger lo hace todo por ti 🚀

---

## 📞 CONTACTO / AYUDA

Si algo no funciona:
1. Verifica que la app está corriendo
2. Recarga la página (F5)
3. Limpia cache del navegador
4. Intenta otro navegador (Chrome, Firefox, Edge)
5. Reinicia la aplicación

**¡Disfruta testando la API!** 🎊

