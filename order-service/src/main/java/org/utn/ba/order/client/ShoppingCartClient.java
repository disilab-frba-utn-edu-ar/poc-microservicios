package org.utn.ba.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.utn.ba.order.client.dto.ShoppingCartOutputDTO;

@FeignClient(name = "cart-service")
public interface ShoppingCartClient {
  @GetMapping("/carts")
  ShoppingCartOutputDTO getMyCart();

  @DeleteMapping("/carts")
  void clearMyCart();
}
