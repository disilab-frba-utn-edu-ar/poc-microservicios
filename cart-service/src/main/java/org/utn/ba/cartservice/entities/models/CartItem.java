package org.utn.ba.cartservice.entities.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItem {
  private Long productId;

  private String productName;

  private Integer amount;

  private Float priceAtTimeOfAdd;

  private String imageUrl;

}
