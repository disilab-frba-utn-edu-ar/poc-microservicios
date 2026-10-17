# ==========================
# Etapa 1: Build de Maven
# ==========================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copia solo las carpetas que este módulo necesita
COPY event-dtos ./event-dtos
COPY cart-service ./cart-service

# 1. Construye e 'instala' event-dtos primero
RUN mvn -B -f event-dtos/pom.xml clean install -DskipTests

# 2. Ahora, construye el 'cart-service'
RUN mvn -B -f cart-service/pom.xml clean package -DskipTests

# ==========================
# Etapa 2: Imagen final
# ==========================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 3. Copia solo el JAR compilado de cart-service
# (Usamos *-SNAPSHOT.jar para que coincida con cualquier nombre)
COPY --from=builder /app/cart-service/target/*-SNAPSHOT.jar app.jar

# 4. Expón el puerto 9813 (el de tu cart-service)
EXPOSE 9813

ENTRYPOINT ["java", "-jar", "app.jar"]