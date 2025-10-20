package org.utn.ba.cartservice.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.utn.ba.cartservice.dto.input.CartItemInputDTO;
import org.utn.ba.cartservice.dto.output.ShoppingCartOutputDTO;
import org.utn.ba.cartservice.dto.input.CartItemUpdateDTO;
import org.utn.ba.cartservice.services.IShoppingCartService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/carts")
public class ShoppingCartController {

  private final IShoppingCartService cartService;
  @GetMapping
  public ResponseEntity<ShoppingCartOutputDTO> getMyCart(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt.getSubject();
    ShoppingCartOutputDTO cartDTO = cartService.getCartByUserId(userId);
    return ResponseEntity.ok(cartDTO);
  }

  @PostMapping("/items")
  public ResponseEntity<ShoppingCartOutputDTO> addItemToMyCart(
      @AuthenticationPrincipal Jwt jwt,
      @RequestBody CartItemInputDTO itemInputDTO) {

    String userId = jwt.getSubject();

    ShoppingCartOutputDTO updatedCartDTO = cartService.addItemToCart(userId, itemInputDTO);
    return ResponseEntity.ok(updatedCartDTO);
  }

  @PatchMapping("/items/{productId}")
  public ResponseEntity<ShoppingCartOutputDTO> updateItemQuantity(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable Long productId,
      @RequestBody CartItemUpdateDTO updateDTO) {
    String userId = jwt.getSubject();
    ShoppingCartOutputDTO updatedCartDTO = cartService.updateItemAmount(userId, productId, updateDTO.amount());
    return ResponseEntity.ok(updatedCartDTO);
  }

  @DeleteMapping("/items/{productId}")
  public ResponseEntity<ShoppingCartOutputDTO> deleteItemFromCart(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable Long productId) {
    String userId = jwt.getSubject();
    ShoppingCartOutputDTO updatedCartDTO = cartService.deleteItemFromCart(userId, productId);
    return ResponseEntity.ok(updatedCartDTO);
  }

  @DeleteMapping
  public ResponseEntity<Void> clearMyCart(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt.getSubject();
    cartService.clearCart(userId);
    return ResponseEntity.noContent().build();
  }


}
