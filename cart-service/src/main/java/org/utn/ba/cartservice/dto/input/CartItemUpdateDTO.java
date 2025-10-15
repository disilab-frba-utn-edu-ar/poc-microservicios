package org.utn.ba.cartservice.dto.input;

import lombok.Builder;

@Builder
public record CartItemUpdateDTO(Integer amount) {
}
