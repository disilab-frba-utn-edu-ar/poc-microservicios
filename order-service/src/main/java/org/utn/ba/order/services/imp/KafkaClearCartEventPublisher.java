package org.utn.ba.order.services.imp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.utn.ba.events.ClearCartEvent;
import org.utn.ba.order.services.ClearCartEventPublisher;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaClearCartEventPublisher implements ClearCartEventPublisher {

  @Value("${kafka.topic.clear-cart}")
  private String clearCartCommandTopic;

  private final KafkaTemplate<String, ClearCartEvent> kafkaTemplate;

  @Override
  public void clearMyCart(String userId) {
    try {
      kafkaTemplate.send(clearCartCommandTopic, userId, new ClearCartEvent(userId));
      log.info("Clear cart command sent for user {}", userId);
    } catch (Exception e) {
      log.error("Failed to send Kafka message to clear cart", e);
    }
  }
}
