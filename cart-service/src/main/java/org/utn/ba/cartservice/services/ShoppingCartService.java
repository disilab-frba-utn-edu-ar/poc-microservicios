package org.utn.ba.cartservice.services;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.utn.ba.cartservice.client.ProductClient;
import org.utn.ba.cartservice.client.dto.ProductOutputDTO;
import org.utn.ba.cartservice.dto.input.CartItemInputDTO;
import org.utn.ba.cartservice.entities.models.ShoppingCart;
import org.utn.ba.cartservice.exceptions.ServiceUnavailableException;
import org.utn.ba.cartservice.mappers.ShoppingCartMapper;
import org.utn.ba.cartservice.dto.output.ShoppingCartOutputDTO;
import org.utn.ba.cartservice.entities.models.CartItem;
import org.utn.ba.cartservice.entities.repositories.ShoppingCartRepository;

@Service
@RequiredArgsConstructor
public class ShoppingCartService implements IShoppingCartService {

  private final ProductClient productClient;

  private final ShoppingCartRepository shoppingCartRepository;

  @Override
  public ShoppingCartOutputDTO getCartByUserId(String userId) {
    return ShoppingCartMapper.toDTO(findOrCreateCart(userId));
  }

  @Override
  @CircuitBreaker(name = "product", fallbackMethod = "addItemToCartFallback")
  public ShoppingCartOutputDTO addItemToCart(String userId, CartItemInputDTO itemInputDTO) {
    ShoppingCart cart = findOrCreateCart(userId);

    ProductOutputDTO product = productClient.getProductById(itemInputDTO.productId()).getBody();

    CartItem newItem = CartItem.builder()
        .productId(itemInputDTO.productId())
        .priceAtTimeOfAdd(product.getPrice())
        .productName(product.getName())
        .amount(itemInputDTO.amount())
        .imageUrl(product.getImageUrl())
        .build();

    cart.addItem(newItem);

    return ShoppingCartMapper.toDTO(shoppingCartRepository.save(cart));
  }

  @Override
  public ShoppingCartOutputDTO updateItemAmount(String userId, Long productId, int newAmount) {
    ShoppingCart cart = findOrCreateCart(userId);

    cart.updateItemAmount(productId, newAmount);

    return ShoppingCartMapper.toDTO(shoppingCartRepository.save(cart));
  }

  @Override
  public ShoppingCartOutputDTO deleteItemFromCart(String userId, Long productId) {
    ShoppingCart cart = findOrCreateCart(userId);

    cart.removeItem(productId);

    return ShoppingCartMapper.toDTO(shoppingCartRepository.save(cart));
  }

  @Override
  public void clearCart(String userId) {
    shoppingCartRepository.deleteById(userId);
  }

  private ShoppingCart findOrCreateCart(String userId) {
    return shoppingCartRepository.findById(userId)
        .orElseGet(() -> new ShoppingCart(userId));
  }

  public ShoppingCartOutputDTO addItemToCartFallback(String userId, CartItemInputDTO itemInputDTO, Throwable throwable) {
    throw new ServiceUnavailableException("Product service is currently unavailable. Please try again later.");
  }
}
