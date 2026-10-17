package org.utn.ba.order.services.imp;

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
import org.utn.ba.order.entities.repositories.OrderRepository;
import org.utn.ba.order.mappers.OrderMapper;
import org.utn.ba.order.mappers.UserDetailsMapper;
import org.utn.ba.order.services.ClearCartEventPublisher;
import org.utn.ba.order.services.IOrderService;
import org.utn.ba.order.services.OrderConfirmationEventPublisher;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.utn.ba.order.dto.CheckoutRequestDTO;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;

@Service
public class OrderService implements IOrderService {

  @Autowired
  private ObservationRegistry observationRegistry;

  @Value("${stripe.api.key}")
  private String stripeApiKey;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private ProductClient productClient;

  @Autowired
  private ShoppingCartClient cartClient;

  @Autowired
  private OrderConfirmationEventPublisher orderConfirmationEventPublisher;

  @Autowired
  private ClearCartEventPublisher clearCartEventPublisher;

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
  public OrderOutputDTO createOrder(UserDetailsDTO userDetailsDTO, CheckoutRequestDTO requestDTO) {
    ShoppingCartOutputDTO cart = cartClient.getMyCart();
    if (cart == null || cart.getItems().isEmpty()) {
        return OrderOutputDTO.builder()
            .description("Cannot create an order from an empty cart.")
            .build();
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

    Stripe.apiKey = stripeApiKey;
    try {
        List<SessionCreateParams.LineItem> stripeLineItems = newOrder.getOrderItems().stream().map(item -> SessionCreateParams.LineItem.builder()
            .setPriceData(
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("usd")
                    .setUnitAmount(Math.round((double) item.getPrice() * 100))
                    .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(item.getProductName())
                            .build()
                    )
                    .build()
            )
            .setQuantity((long) item.getAmount())
            .build()).toList();

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(requestDTO.getSuccessUrl())
            .setCancelUrl(requestDTO.getCancelUrl())
            .setClientReferenceId(newOrder.getId().toString())
            .addAllLineItem(stripeLineItems)
            .build();

        Session session = Observation.createNotStarted("stripe.checkout.session", observationRegistry)
            .lowCardinalityKeyValue("peer.service", "stripe")
            .observeChecked(() -> Session.create(params));

        newOrder.setStripeSessionId(session.getId());
        this.orderRepository.save(newOrder);

        OrderOutputDTO output = OrderMapper.createFrom(newOrder);
        return OrderOutputDTO.builder()
            .id(output.id())
            .date(output.date())
            .finalPrice(output.finalPrice())
            .userDetails(output.userDetails())
            .orderItems(output.orderItems())
            .description(output.description())
            .status(output.status())
            .stripeCheckoutUrl(session.getUrl())
            .stripeSessionId(session.getId())
            .build();
    } catch (StripeException e) {
        System.err.println("Failed to create Stripe Checkout Session: " + e.getMessage());
        this.orderRepository.delete(newOrder);
        throw new RuntimeException("Payment service unavailable: " + e.getMessage());
    }
  }

  @Override
  public OrderOutputDTO findByStripeSessionIdForUser(String sessionId, String userId) {
      Order order = this.orderRepository.findByStripeSessionIdAndUserDetails_UserId(sessionId, userId)
              .orElse(null);
      return order != null ? OrderMapper.createFrom(order) : null;
  }

  @Override
  public void confirmPayment(Long orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    
    order.markAsPaid();
    orderRepository.save(order);

    this.orderConfirmationEventPublisher.publishOrderConfirmation(order);
    this.clearCartEventPublisher.clearMyCart(order.getUserDetails().getUserId());
  }

  @Override
  public void cancelOrder(Long orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    
    order.cancel();
    orderRepository.save(order);
  }

  public OrderOutputDTO fallbackCreateOrderWithProduct(UserDetailsDTO userDetailsDTO, CheckoutRequestDTO requestDTO, Throwable t) {

    return OrderOutputDTO.builder()
        .description("Failed to create Order as " +
            "Product Service or Cart service may be down, error -> " + t.getMessage())
        .build();
  }

}
