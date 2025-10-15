package org.utn.ba.cartservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ItemNotFoundInCartException extends RuntimeException {
  public ItemNotFoundInCartException(Long productId) {
    super("Item with ID " + productId + " not found in cart.");
  }
}
