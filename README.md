# Ejemplo Arquitectura de Microservicios en Java 17 - Sistema de Órdenes y Productos

Este proyecto muestra cómo crear microservicios con Spring Boot. Se permite la conexión entre sí mediante Spring Cloud OpenFeign, sumado a la utilización de Spring Cloud Eureka Server para implementar un Service Registry y Spring Cloud Gateway como API Gateway.

## Arquitectura
El sistema sigue un estilo arquitectónico de microservicios con integración tanto síncrona (REST / OpenFeign) como asíncrona basada en eventos (EDA con Apache Kafka):

- **API Gateway (Spring Cloud Gateway :8080):** Punto de entrada único para el tráfico externo, ruteo dinámico y validación de tokens JWT.
- **Service Registry (Netflix Eureka :8761):** Registro y descubrimiento dinámico de instancias de microservicios.
- **Product Service (:9811):** Catálogo de productos persistido en MySQL e imágenes en Object Storage (MinIO S3).
- **Cart Service (:9813):** Gestión de carritos de compras persistido en MongoDB y sincronizado por eventos de Kafka.
- **Order Service (:9812):** Gestión de órdenes persistido en MySQL, integración de pagos con Stripe y emisión de eventos hacia Kafka.
- **Notification Service (:9814):** Servicio desacoplado que consume eventos de Kafka para envío de correos vía SMTP.
- **Frontend SPA (:3000):** Aplicación web en React + Tailwind + Vite.

El diagrama de componentes que comunica esta arquitectura es:
<img width="2861" height="1301" alt="image" src="https://github.com/user-attachments/assets/9b1e79c5-ecf3-478a-916d-41f944f4d27b" />


## Tecnologías Utilizadas

- **Java 17**
- **React, Tailwind y Vite** (Frontend SPA)
- **Spring Boot 3.3** & **Spring Cloud 2023**
- **Spring Data JPA** (MySQL) & **Spring Data MongoDB**
- **Spring Cloud Netflix Eureka** (Service Registry & Discovery)
- **Spring Cloud Gateway** (API Gateway)
- **Spring Cloud OpenFeign** (Cliente HTTP declarativo entre microservicios)
- **Resilience4j** (Circuit Breaker y tolerancia a fallos)
- **Apache Kafka** (Broker de mensajería orientada a eventos - EDA)
- **Stripe SDK** (Pasarela de pagos mediante Checkout Sessions y Webhooks)
- **MinIO** (Almacenamiento de objetos compatible con AWS S3 con subida directa vía Presigned URLs)
- **Observabilidad & Telemetría:** Prometheus (métricas), Grafana (dashboards), Tempo / Micrometer (trazabilidad distribuida) y Loki (logs)
- **Auth0 & Spring Security OAuth2** (Autenticación y autorización basada en JWT)
- **Docker & Docker Compose** (Infraestructura de soporte)
  
## Estructura de Proyecto
Los microservicios de backend se encuentran estructurados bajo una arquitectura por capas:

```plaintext
src/
 └── main/
     └── java/
         └── org/
             └── utn/
                 └── ba/
                     └── service/
                         ├── client/                  # Clientes OpenFeign para comunicación inter-servicio
                         ├── controllers/             # Controladores REST
                         ├── dto/                     # Data Transfer Objects
                         ├── entities/ / models/      # Entidades y Repositorios
                         ├── exceptions/              # Manejo global de excepciones
                         ├── mappers/                 # Mapeadores DTO <-> Entidad
                         ├── messaging/ / services/   # Lógica de negocio y eventos
                         └── ServiceApplication.java  # Clase principal Spring Boot
```

## Circuit Breaker
En caso de que una instancia del microservicio de Productos falle o esté caída y se realice una solicitud a este mediante el microservicio de Órdenes o Carrito, se activará el Circuit Breaker provisto por Resilience4J, evitando llamadas en cascada y ejecutando los métodos de fallback correspondientes.

## Seguridad
La autenticación se realiza mediante Auth0 (OAuth2 / OIDC con PKCE en la SPA). Cada microservicio y el API Gateway actúan como Resource Servers validando el Access Token JWT provisto en las cabeceras `Authorization: Bearer`.
