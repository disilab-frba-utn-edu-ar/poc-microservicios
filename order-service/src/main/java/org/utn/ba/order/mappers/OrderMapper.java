package org.utn.ba.order.mappers;

import org.utn.ba.order.client.dto.ProductOutputDTO;
import org.utn.ba.order.dto.OrderInputDTO;
import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.entities.models.Order;

public class OrderMapper {

    public static OrderOutputDTO createFrom (Order order, ProductOutputDTO product) {

        return OrderOutputDTO.
                builder()
                .id(order.getId())
                .date(order.getDate())
                .product(product)
                .finalPrice(order.getFinalPrice())
                .amount(order.getAmount())
                .description("")
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
