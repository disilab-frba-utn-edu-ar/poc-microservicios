package org.utn.ba.cartservice.mappers;

import org.utn.ba.cartservice.client.dto.ProductOutputDTO;
import org.utn.ba.cartservice.dto.input.CartItemInputDTO;
import org.utn.ba.cartservice.dto.output.CartItemOutputDTO;
import org.utn.ba.cartservice.entities.models.CartItem;

public class CartItemMapper {
  public static CartItemOutputDTO toDto(CartItem item) {

    if (item == null) {
      return null;
    }

    return CartItemOutputDTO.builder()
        .productId(item.getProductId())
        .productName(item.getProductName())
        .amount(item.getAmount())
        .priceAtTimeOfAdd(item.getPriceAtTimeOfAdd())
        .imageUrl(item.getImageUrl())
        .build();
  }

  public static CartItem fromDto(ProductOutputDTO product, CartItemInputDTO inputDTO) {
    return CartItem.builder()
        .productId(product.getId())
        .productName(product.getName())
        .priceAtTimeOfAdd(product.getPrice())
        .imageUrl(product.getImageUrl())
        .amount(inputDTO.amount())
        .build();
  }
}
