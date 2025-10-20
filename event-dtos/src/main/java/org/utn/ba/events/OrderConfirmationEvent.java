package org.utn.ba.events;

import java.time.LocalDate;
import java.util.List;

public record OrderConfirmationEvent(
    Long orderId,
    String userId,
    String userEmail,
    String firstName,
    LocalDate orderDate,
    List<OrderItemInfo> items,
    Float finalPrice
) {
}
