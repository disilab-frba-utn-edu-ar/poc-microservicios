package org.utn.ba.order.services;

import org.utn.ba.order.entities.models.Order;

public interface OrderConfirmationEventPublisher {
  void publishOrderConfirmation(Order order);
}
