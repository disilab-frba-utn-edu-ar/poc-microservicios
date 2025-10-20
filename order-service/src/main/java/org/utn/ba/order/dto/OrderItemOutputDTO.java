package org.utn.ba.order.dto;

import lombok.Builder;

@Builder
public record OrderItemOutputDTO(Long id, Long productId, String productName, Float price, String imageUrl,
                                 Integer amount) {
}
