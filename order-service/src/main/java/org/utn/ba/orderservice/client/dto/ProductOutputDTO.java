package org.utn.ba.orderservice.client.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class ProductOutputDTO {

    private Long id;
    private String name;
    private Float price;
}
