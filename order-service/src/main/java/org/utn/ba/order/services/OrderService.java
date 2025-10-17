package org.utn.ba.order.services;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.utn.ba.order.client.ProductClient;
import org.utn.ba.order.client.ShoppingCartClient;
import org.utn.ba.order.client.dto.ProductOutputDTO;
import org.utn.ba.order.client.dto.ShoppingCartOutputDTO;
import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.dto.UserDetailsDTO;
import org.utn.ba.order.entities.models.Order;
import org.utn.ba.order.entities.models.OrderItem;
import org.utn.ba.order.entities.repositories.repositories.OrderRepository;
import org.utn.ba.order.mappers.OrderMapper;
import org.utn.ba.order.mappers.UserDetailsMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService implements IOrderService {

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private ProductClient productClient;

  @Autowired
  private ShoppingCartClient cartClient;

  @Override
  public List<OrderOutputDTO> findAll() {

    return orderRepository.findAll()
        .stream()
        .map(OrderMapper::createFrom).
        collect(Collectors.toList());
  }


  @Override
  public OrderOutputDTO findById(Long id) {

    return orderRepository.findById(id)
        .map(OrderMapper::createFrom)
        .orElse(null);
  }

  @Override
  @CircuitBreaker(name = "product", fallbackMethod = "fallbackCreateOrderWithProduct")
  public OrderOutputDTO createOrder(UserDetailsDTO userDetailsDTO) {
    ShoppingCartOutputDTO cart = cartClient.getMyCart();
    if (cart == null || cart.getItems().isEmpty()) {
      throw new IllegalStateException("Cannot create an order from an empty cart.");
    }

    Order newOrder = new Order();
    newOrder.setDate(LocalDate.now());
    newOrder.setUserDetails(UserDetailsMapper.createFrom(userDetailsDTO));
    List<OrderItem> itemList = cart.getItems()
        .stream().map(i -> {
          ProductOutputDTO product = productClient.getProductById(i.getProductId()).getBody();
          return OrderItem.builder()
              .productId(product.getId())
              .price(product.getPrice())
              .amount(i.getAmount())
              .imageUrl(product.getImageUrl())
              .order(newOrder)
              .productName(product.getName())
              .build();
        })
        .toList();

    itemList.forEach(newOrder::addOrderItem);

    newOrder.calculateFinalPrice();
    this.orderRepository.save(newOrder);


    // TODO: que pasa si falla justo aca?
    cartClient.clearMyCart();

    return OrderMapper.createFrom(newOrder);

  }

  public OrderOutputDTO fallbackCreateOrderWithProduct(Throwable t) {

    return OrderOutputDTO.builder()
        .description("Failed to create Order as " +
            "Product Service or Cart service may be down, error -> " + t.getMessage())
        .build();
  }

}
