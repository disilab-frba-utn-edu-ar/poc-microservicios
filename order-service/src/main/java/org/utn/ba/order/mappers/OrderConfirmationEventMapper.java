package org.utn.ba.order.mappers;

import org.utn.ba.events.OrderConfirmationEvent;
import org.utn.ba.events.OrderItemInfo;
import org.utn.ba.order.entities.models.Order;
import org.utn.ba.order.entities.models.OrderItem;
import java.util.stream.Collectors;

public class OrderConfirmationEventMapper {
  public static OrderConfirmationEvent fromOrder(Order order){
    return new OrderConfirmationEvent(order.getId(),
        order.getUserDetails().getUserId(),
        order.getUserDetails().getUserEmail(),
        order.getUserDetails().getFirstName(),
        order.getDate(),
        order.getOrderItems().stream().map(OrderConfirmationEventMapper::fromItem).collect(Collectors.toList()),
        order.getFinalPrice());
  }

  private static OrderItemInfo fromItem(OrderItem item){
    return new OrderItemInfo(item.getProductId(),
        item.getProductName(),
        item.getAmount(),
        item.getPrice(),
        item.getImageUrl());
  }
}
