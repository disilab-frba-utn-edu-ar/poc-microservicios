package org.utn.ba.events;

public record OrderItemInfo(
    Long productId,
    String productName,
    Integer amount,
    Float price,
    String imageUrl
) {
}