package org.utn.ba.order.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class OrderInputDTO {

    private LocalDate date;
    private Long productId;
    private Integer amount;

}
