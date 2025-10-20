package org.utn.ba.cartservice.services;

import org.utn.ba.cartservice.dto.input.CartItemInputDTO;
import org.utn.ba.cartservice.dto.output.ShoppingCartOutputDTO;

public interface IShoppingCartService {
  ShoppingCartOutputDTO getCartByUserId(String userId);
  ShoppingCartOutputDTO addItemToCart(String userId, CartItemInputDTO itemInputDTO);

  ShoppingCartOutputDTO updateItemAmount(String userId, Long productId, int newAmount);

  ShoppingCartOutputDTO deleteItemFromCart(String userId, Long productId);

  void clearCart(String userId);
}
