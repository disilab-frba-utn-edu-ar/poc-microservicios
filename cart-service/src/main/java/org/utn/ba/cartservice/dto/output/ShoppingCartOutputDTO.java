package org.utn.ba.cartservice.dto.output;

import lombok.Builder;
import java.time.Instant;
import java.util.List;

@Builder
public record ShoppingCartOutputDTO(List<CartItemOutputDTO> items, Instant lastModifiedDate) {
}
