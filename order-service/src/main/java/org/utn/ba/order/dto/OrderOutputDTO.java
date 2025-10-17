package org.utn.ba.order.dto;

import lombok.Builder;
import java.time.LocalDate;
import java.util.List;

@Builder
public record OrderOutputDTO(Long id, LocalDate date, Float finalPrice, UserDetailsDTO userDetails,
                             List<OrderItemOutputDTO> orderItems, String description) {
}
