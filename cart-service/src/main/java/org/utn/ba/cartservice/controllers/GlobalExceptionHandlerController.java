package org.utn.ba.cartservice.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.utn.ba.cartservice.exceptions.ItemNotFoundInCartException;
import org.utn.ba.cartservice.exceptions.ServiceUnavailableException;

@ControllerAdvice
public class GlobalExceptionHandlerController {

  @ExceptionHandler(ItemNotFoundInCartException.class)
  public ResponseEntity<?> itemNotFoundExceptionHandler(Exception e) {
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(e.getMessage());
  }

  @ExceptionHandler(ServiceUnavailableException.class)
  public ResponseEntity<?> serviceUnavaibleExceptionHandler(Exception e) {
    return ResponseEntity
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .body(e.getMessage());
  }
}
