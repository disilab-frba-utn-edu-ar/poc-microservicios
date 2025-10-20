package org.utn.ba.cartservice.dto.input;

import lombok.Builder;

@Builder
public record CartItemInputDTO(Long productId, Integer amount) {
}
