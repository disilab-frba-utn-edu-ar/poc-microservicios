# ==========================
# Etapa 1: Build de Maven
# ==========================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copia solo las carpetas que este módulo necesita
COPY event-dtos ./event-dtos
COPY order-service ./order-service

# 1. Construye e 'instala' event-dtos primero
RUN mvn -B -f event-dtos/pom.xml clean install -DskipTests

# 2. Ahora, construye el 'order-service'
RUN mvn -B -f order-service/pom.xml clean package -DskipTests

# ==========================
# Etapa 2: Imagen final
# ==========================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 3. Copia solo el JAR compilado de order-service
COPY --from=builder /app/order-service/target/*-SNAPSHOT.jar app.jar

# 4. Expón el puerto 9812 (el de tu order-service)
EXPOSE 9812

ENTRYPOINT ["java","-jar","/app/app.jar"]