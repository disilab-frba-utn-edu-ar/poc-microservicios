package org.utn.ba.cartservice.exceptions;

public class ItemNotFoundInCartException extends RuntimeException {
  public ItemNotFoundInCartException(Long productId) {
    super("Item with ID " + productId + " not found in cart.");
  }
}
