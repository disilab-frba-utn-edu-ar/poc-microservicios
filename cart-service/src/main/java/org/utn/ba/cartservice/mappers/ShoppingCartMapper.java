package org.utn.ba.cartservice.mappers;

import org.utn.ba.cartservice.entities.models.ShoppingCart;
import org.utn.ba.cartservice.dto.output.ShoppingCartOutputDTO;
import java.util.stream.Collectors;

public class ShoppingCartMapper {
  public static ShoppingCartOutputDTO toDTO(ShoppingCart cart) {
    if (cart == null) {
      return null;
    }

    return ShoppingCartOutputDTO.builder()
        .lastModifiedDate(cart.getLastModifiedDate())
        .items(cart.getItems().stream().map(CartItemMapper::toDto)
            .collect(Collectors.toList()))
        .build();
  }
}
