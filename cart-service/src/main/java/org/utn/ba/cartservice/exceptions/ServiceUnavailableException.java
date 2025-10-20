package org.utn.ba.cartservice.exceptions;

public class ServiceUnavailableException extends RuntimeException{
  public ServiceUnavailableException(String message) {
    super(message);
  }
}
