package org.utn.ba.orderservice.mappers;

import org.utn.ba.orderservice.client.dto.ProductOutputDTO;
import org.utn.ba.orderservice.dto.OrderInputDTO;
import org.utn.ba.orderservice.dto.OrderOutputDTO;
import org.utn.ba.orderservice.entities.models.Order;

public class OrderMapper {

    public static OrderOutputDTO createFrom (Order order, ProductOutputDTO product) {

        return OrderOutputDTO.
                builder()
                .id(order.getId())
                .date(order.getDate())
                .product(product)
                .finalPrice(order.getFinalPrice())
                .amount(order.getAmount())
                .build();
    }

    public static Order createFrom (OrderInputDTO orderInputDTO) {

        return Order.builder()
                .date(orderInputDTO.getDate())
                .productId(orderInputDTO.getProductId())
                .amount(orderInputDTO.getAmount())
                .build();
    }

}
