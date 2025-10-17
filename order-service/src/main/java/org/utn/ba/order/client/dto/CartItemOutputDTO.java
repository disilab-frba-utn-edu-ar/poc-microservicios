package org.utn.ba.order.client.dto;

import lombok.Data;

@Data
public class CartItemOutputDTO {
  private Long productId;
  private String productName;
  private int amount;
  private Float priceAtTimeOfAdd;
}
