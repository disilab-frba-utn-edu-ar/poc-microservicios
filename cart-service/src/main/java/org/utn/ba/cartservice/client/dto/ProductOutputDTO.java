package org.utn.ba.cartservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductOutputDTO {

    private Long id;
    private String name;
    private Float price;
    private String imageUrl;

    public ProductOutputDTO(Long id) {
        this.id = id;
    }
}
