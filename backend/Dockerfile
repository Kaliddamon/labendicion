# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar y empaquetar
RUN mvn clean package -DskipTests -q

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# wget no viene en la JRE Alpine; lo necesita HEALTHCHECK
RUN apk add --no-cache wget

# Copiar JAR desde stage de build
COPY --from=builder /app/target/labendicion-0.0.1-SNAPSHOT.jar app.jar

# Por defecto Spring Boot escucha en 8080; muchas nubes inyectan PORT
EXPOSE 8080

# Requiere spring-boot-starter-actuator (ver pom.xml). Respeta PORT si la nube lo define.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD sh -c "wget --no-verbose --tries=1 --spider http://127.0.0.1:$${PORT:-8080}/actuator/health || exit 1"

# Perfil por defecto: render (H2, arranca sin Postgres). En Railway/prod: SPRING_PROFILES_ACTIVE=prod + DATABASE_URL.
ENTRYPOINT ["sh", "-c", "java -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-render} -jar app.jar"]



