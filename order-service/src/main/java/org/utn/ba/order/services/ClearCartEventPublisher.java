package org.utn.ba.order.services;

public interface ClearCartEventPublisher {
  void clearMyCart(String userId);
}
