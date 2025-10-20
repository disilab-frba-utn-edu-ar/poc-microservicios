package org.utn.ba.cartservice.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.utn.ba.cartservice.services.IShoppingCartService;
import org.utn.ba.events.ClearCartEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class ClearCartEventListener {
  private final IShoppingCartService cartService;

  @KafkaListener(topics = "${kafka.topic.clear-cart}", groupId = "cart-clear-group")
  public void handleClearCartCommand(ClearCartEvent event) {
    log.info("Received ClearCart command for user: {}", event.userId());
    try {
      cartService.clearCart(event.userId());
      log.info("Cart cleared successfully for user: {}", event.userId());
    } catch (Exception e) {
      log.error("Failed to clear cart for user {}: {}", event.userId(), e.getMessage(), e);
    }
  }
}
