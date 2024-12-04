# Ejemplo Arquitectura de Microservicios en Java 17 - Sistema de Órdenes y Productos

Este proyecto muestra cómo crear microservicios simples con Spring Boot. Se permite la conexión entre sí mediante Spring Cloud Open Feign, sumado a la utilización de Spring Cloud Eureka Server para implementar un Service Registry y Spring Cloud Gateway como API Gateway. 

## Arquitectura
El módulo sigue un estilo arquitectónico de microservicios. Se tienen dos microservicios (Órdenes y Productos) que se registran a sí mismos en el Service Discovery (implementado con Eureka Server) y se comunican entre sí mediante un cliente REST (Open Feign). Todo el sistema se esconde detrás del API Gateway.

El diagrama de componentes que comunica esta arquitectura es:
![image](https://github.com/user-attachments/assets/eaca40e2-e64e-471e-b83e-17a8aa9d3778)


## Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.3**
- **Spring Data JPA** (para interacción con la base de datos)
- **Maven** (gestor de dependencias)
- **Lombok** (para reducir el código boilerplate)
- **MySQL**
- **Spring Cloud Netflix Eureka** (Service Registry & Discovery)
- **Spring Cloud Gateway** (API Gateway)
- **Spring Cloud Open Feign** (Cliente REST)
- **Resilience 4J** (Circuit Breaker)

## Estructura de Proyecto
Los proyectos de Órdenes y Productos están organizados de la siguiente manera:

```plaintext
src/
 └── main/
     └── java/
         └── org/
             └── utn/
                 └── ba/
                     └── service/
                         ├── client/                  # Lógica para llamar a otro Microservicio con OpenFeign
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
  
## Circuit Breaker
En caso de que una instancia del microservicio de Productos falle o esté caído y se realice una solicitud a este mediante el microservicio de Órdenes, se activará el Circuit Breaker provisto por Resilience4J. 
