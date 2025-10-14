package org.utn.ba.cartservice.dto.output;

import lombok.Builder;

@Builder
public record CartItemOutputDTO(Long productId, String productName, Integer amount
     ,Float priceAtTimeOfAdd, String imageUrl) {
}
