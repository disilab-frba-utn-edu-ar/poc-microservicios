# Ejemplo Arquitectura de Microservicios en Java 17 - Sistema de Órdenes y Productos

Este proyecto muestra cómo crear microservicios simples con Spring Boot. Se permite la conexión entre sí mediante Spring Cloud Open Feign, sumado a la utilización de Spring Cloud Eureka Server para implementar un Service Registry y Spring Cloud Gateway como API Gateway.

## Arquitectura
El módulo sigue un estilo arquitectónico de microservicios. Se tienen cuatro microservicios (Órdenes, Productos, Carrito y Notificaciones) que se registran a sí mismos en el Service Discovery (implementado con Eureka Server) y se comunican entre sí mediante un cliente REST (Open Feign). Todo el sistema se esconde detrás del API Gateway, exceptuando por el microservicio de Notificaciones. Además, se cuenta con una cola de mensajes con Apache Kafka, que permite enviar correos electrónicos luego de efectuada una orden o avisar la confirmación de la misma para vaciar el carrito en el microservicio correspondiente.

El diagrama de componentes que comunica esta arquitectura es:
<img width="2861" height="1301" alt="image" src="https://github.com/user-attachments/assets/9b1e79c5-ecf3-478a-916d-41f944f4d27b" />


## Tecnologías Utilizadas

- **Java 17**
- **React, Tailwind y Vite** (para el frontend)
- **Spring Boot 3.3**
- **Spring Data JPA** (para interacción con la base de datos)
- **Maven** (gestor de dependencias)
- **Lombok** (para reducir el código boilerplate)
- **MySQL**
- **MongoDB**
- **Spring Cloud Netflix Eureka** (Service Registry & Discovery)
- **Spring Cloud Gateway** (API Gateway)
- **Spring Cloud Open Feign** (Cliente REST)
- **Resilience 4J** (Circuit Breaker)
- **Apache Kafka** (Integración por cola de mensajes entre Órdenes con Carrito y Órdenes con Notificaciones)
- **Docker** (para portabilidad en la base de datos de Mongo y Kafka)
- **Auth0** (implementación de SSO para acceder al Sistema)
- **Spring Security** 
  
## Estructura de Proyecto
Los proyectos de Órdenes, Productos y Carrito se encuentran estructurados de la siguiente forma. 

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
- **4.** Correr los microservicios de Productos, Órdenes, Carrito y Notificaciones. Además, para el envío de mail se debe crear un servidor de mail propio y configurarlo en el application.properties del microservicio de Notificaciones. 
- **5.** Correr el API Gateway. Este permitirá redirigir cualquier solicitud al microservicio específico dependiendo de la configuración del *proxy*.
- **6** Correr el front server con el comando npm run dev, el cual se levantará en el puerto 3000. 
  
## Circuit Breaker
En caso de que una instancia del microservicio de Productos falle o esté caído y se realice una solicitud a este mediante el microservicio de Órdenes, se activará el Circuit Breaker provisto por Resilience4J. La misma situación ocurrirá al realizar una solicitud desde el microservicio de Carrito a Productos.

## Seguridad
En cada microservicio y el API Gateway se realiza una validación de roles y permisos a partir del JWT provisto a raíz del Auth0. 
