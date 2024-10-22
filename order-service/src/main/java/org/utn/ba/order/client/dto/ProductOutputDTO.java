package org.utn.ba.order.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
@AllArgsConstructor
public class ProductOutputDTO {

    private Long id;
    private String name;
    private Float price;

    public ProductOutputDTO(Long id) {
        this.id = id;
    }
}
