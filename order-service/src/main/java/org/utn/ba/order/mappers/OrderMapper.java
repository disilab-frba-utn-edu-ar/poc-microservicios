package org.utn.ba.order.mappers;

import org.utn.ba.order.dto.OrderItemOutputDTO;
import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.entities.models.Order;
import org.utn.ba.order.entities.models.OrderItem;
import org.utn.ba.order.entities.models.OrderStatus;

public class OrderMapper {

    public static OrderItemOutputDTO createFrom (OrderItem item) {

        return OrderItemOutputDTO.
                builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .amount(item.getAmount())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .build();
    }



    public static OrderOutputDTO createFrom(Order order){
        return OrderOutputDTO.builder()
            .id(order.getId())
            .description(order.getStatus() != null && order.getStatus().equals(OrderStatus.PAID) ? "Pago confirmado" : "Pago en proceso")
            .status(order.getStatus() != null ? order.getStatus().name() : null)
            .userDetails(UserDetailsMapper.createFrom(order.getUserDetails()))
            .date(order.getDate())
            .finalPrice(order.getFinalPrice())
            .stripeSessionId(order.getStripeSessionId())
            .orderItems(order.getOrderItems().stream().map(OrderMapper::createFrom).toList())
            .build();
    }

}
