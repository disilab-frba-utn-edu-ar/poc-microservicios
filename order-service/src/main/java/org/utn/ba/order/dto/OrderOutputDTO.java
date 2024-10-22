package org.utn.ba.order.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.utn.ba.order.client.dto.ProductOutputDTO;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class OrderOutputDTO {
    private Long id;
    private LocalDate date;
    private ProductOutputDTO product;
    private Integer amount;
    private Float finalPrice;
    private String description = "";


}