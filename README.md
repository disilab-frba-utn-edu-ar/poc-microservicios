# Ejemplo Arquitectura de Microservicios en Java 17 - Sistema de Órdenes y Productos

Este proyecto muestra cómo crear microservicios simples con Spring Boot. Se permite la conexión entre sí mediante Spring Cloud Open Feign, sumado a la utilización de Spring Cloud Eureka Server para implementar un Service Registry y Spring Cloud Gateway como API Gateway.

## Arquitectura
El módulo sigue un estilo arquitectónico de microservicios. Se tienen dos microservicios (Órdenes y Productos) que se registran a sí mismos en el Service Discovery (implementado con Eureka Server) y se comunican entre sí mediante un cliente REST (Open Feign). Todo el sistema se esconde detrás del API Gateway.

## Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.3**
- **Spring Data JPA** (para interacción con la base de datos)
- **Maven** (gestor de dependencias)
- **Lombok** (para reducir el código boilerplate)
- **MySQL**
- **Spring Cloud Netflix Eureka**
- **Spring Cloud Gateway**
- **Spring Cloud Open Feign**

## Estructura de Proyecto
Los proyectos de Órdenes y Productos está organizado de la siguiente manera:

```plaintext
src/
 └── main/
     └── java/
         └── com/
             └── utn/
                 └── ba/
                     └── service/
                         ├── controllers/             # Controladores REST
                         ├── dtos/                    # Data Transfer Object
                         ├── exceptions/              # Manejo de Excepciones
                         ├── mappers/                 # Mapeadores de DTOs a Entidades
                         ├── models/                  # Entidades y Repositorios
                         ├── services/                # Servicios
                         └── ServiceApplication.java  # Clase principal
```
## Pasos para Ejecución del Proyecto

- **1.** Clonar la aplicación.
- **2.** Cambiar los puertos para las aplicaciones como prefieras. Para eso, abrir en los proyectos  `src/main/resources/application.properties` y cambiar la propiedad `server.port`. Para el API Gateway se puede cambiar el puerto por defecto abriendo el archivo  `src/main/resources/application.yml` y cambiar la propiedad `server.port`.
- **3.** Correr el Service Registry & Discovery. Iniciará en el puerto `8761` por defecto. Una vez que inicie la aplicación, podrás visitar el *dashboard* de Eureka bajo  `http://localhost:8761`.
- **4.** Correr los microservicios de Productos y de Órdenes.
- **5.** Correr el API Gateway. Este permitirá redirigir cualquier solicitud al microservicio específico dependiendo de la configuración del *proxy*. 
