# Deploy Backend en Railway

## 1) Variables de entorno (Railway)

Configura estas variables en el servicio de backend:

- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL=<url postgres de railway>`
- `PGUSER=<usuario postgres>`
- `PGPASSWORD=<password postgres>`
- `CORS_ALLOWED_ORIGINS=https://<tu-frontend>.vercel.app`
- `SWAGGER_ENABLED=true` (opcional)

> Si tienes varios dominios frontend, separalos por coma en `CORS_ALLOWED_ORIGINS`.

## 2) Perfil de produccion

El perfil `prod` usa:

- PostgreSQL
- `spring.jpa.hibernate.ddl-auto=validate`
- CORS por variable de entorno
- health endpoint en `/actuator/health`

## 3) Build y arranque

Railway detecta el proyecto con `railway.json`:

- build: Nixpacks
- start: `java -Dspring.profiles.active=prod -jar target/*.jar`

## 4) Verificacion

- Healthcheck: `https://<tu-backend>.up.railway.app/actuator/health`
- API frontend-sync: `https://<tu-backend>.up.railway.app/api/frontend/bootstrap`
