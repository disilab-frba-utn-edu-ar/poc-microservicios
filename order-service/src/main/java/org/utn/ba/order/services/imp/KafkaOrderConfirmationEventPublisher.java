package org.utn.ba.order.services.imp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.utn.ba.events.OrderConfirmationEvent;
import org.utn.ba.order.entities.models.Order;
import org.utn.ba.order.mappers.OrderConfirmationEventMapper;
import org.utn.ba.order.services.OrderConfirmationEventPublisher;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaOrderConfirmationEventPublisher implements OrderConfirmationEventPublisher {
  private final KafkaTemplate<String, OrderConfirmationEvent> kafkaTemplate;

  @Value("${kafka.topic.order-confirmations}")
  private String orderTopic;

  @Override
  public void publishOrderConfirmation(Order order) {
    try {
      OrderConfirmationEvent event = OrderConfirmationEventMapper.fromOrder(order);
      kafkaTemplate.send(orderTopic, String.valueOf(order.getId()), event);
      log.info("Order confirmation event sent for order ID: {}", order.getId());
    } catch (Exception e) {
      log.error("Failed to send Kafka message for order {}: {}", order.getId(), e.getMessage(), e);
    }
  }
}
