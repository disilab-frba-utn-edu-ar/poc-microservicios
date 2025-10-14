package org.utn.ba.cartservice.mappers;

import org.utn.ba.cartservice.client.dto.ProductOutputDTO;
import org.utn.ba.cartservice.dto.input.CartItemInputDTO;
import org.utn.ba.cartservice.dto.output.CartItemOutputDTO;
import org.utn.ba.cartservice.entities.models.CartItem;

public class CartItemMapper {
  private static CartItemOutputDTO toDto(CartItem item){
    return CartItemOutputDTO.builder()
        .productId(item.getProductId())
        .productName(item.getProductName())
        .amount(item.getAmount())
        .priceAtTimeOfAdd(item.getPriceAtTimeOfAdd())
        .imageUrl(item.getProductName())
        .build();
  }

  private static CartItem fromDto(ProductOutputDTO dto){
    return null;
  }
}
