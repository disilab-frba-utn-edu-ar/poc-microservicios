package org.utn.ba.order.services;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.utn.ba.order.client.ProductClient;
import org.utn.ba.order.client.dto.ProductOutputDTO;
import org.utn.ba.order.dto.OrderInputDTO;
import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.mappers.OrderMapper;
import org.utn.ba.order.entities.models.Order;
import org.utn.ba.order.entities.repositories.repositories.OrderRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductClient productClient;

    @Override
    @CircuitBreaker(name="product",fallbackMethod = "fallbackGetProductById" )
    public List<OrderOutputDTO> findAll() {

        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(order -> {
            ProductOutputDTO product = productClient.getProductById(order.getProductId()).getBody();
            return OrderMapper.createFrom(order, product);
        }).collect(Collectors.toList());

    }

    public List<OrderOutputDTO> fallbackGetProductById(Throwable t) {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            ProductOutputDTO product = ProductOutputDTO.builder()
                            .name("Cannot get product detail as Product Service may be down, error is -> " + t.getMessage())
                            .price(0f)
                            .id(order.getProductId()).build();
            return OrderMapper.createFrom(order, product);
        }).collect(Collectors.toList());
    }

    @Override
    public OrderOutputDTO findById(Long id) {

        Optional<Order> order = orderRepository.findById(id);

        if (order.isPresent()) {
            ProductOutputDTO product = productClient.getProductById(order.get().getProductId()).getBody();
            return order.map(o -> OrderMapper.createFrom(o, product)).orElse(null);

        }

        return null;

    }

    @Override
    @CircuitBreaker(name="product",fallbackMethod = "fallbackCreateOrderWithProduct" )
    public OrderOutputDTO createOrder(OrderInputDTO order) {

        Order newOrder = OrderMapper.createFrom(order);

        ProductOutputDTO product = productClient.getProductById(order.getProductId()).getBody();

        newOrder.setFinalPrice(product.getPrice() * newOrder.getAmount());

        this.orderRepository.save(newOrder);
        return OrderMapper.createFrom(newOrder, product);

    }

    public OrderOutputDTO fallbackCreateOrderWithProduct(Throwable t) {

       return OrderOutputDTO.builder()
               .description("Failed to create Order as " +
                       "Product Service may be down, error -> " + t.getMessage())
               .build();
    }
}
