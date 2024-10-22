package org.utn.ba.order.services;

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
    public List<OrderOutputDTO> findAll() {

        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(order -> {
            ProductOutputDTO product = productClient.getProductById(order.getProductId()).getBody();
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
    public OrderOutputDTO createOrder(OrderInputDTO order) {

        Order newOrder = OrderMapper.createFrom(order);

        ProductOutputDTO product = productClient.getProductById(order.getProductId()).getBody();

        newOrder.setFinalPrice(product.getPrice() * newOrder.getAmount());

        this.orderRepository.save(newOrder);
        return OrderMapper.createFrom(newOrder, product);

    }
}
