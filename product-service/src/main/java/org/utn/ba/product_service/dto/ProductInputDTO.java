package org.utn.ba.product_service.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductInputDTO {

    private String name;
    private Float price;
}
