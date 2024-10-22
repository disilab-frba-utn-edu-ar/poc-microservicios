package org.utn.ba.product.mappers;

import org.utn.ba.product.dto.ProductOutputDTO;
import org.utn.ba.product.models.entities.Product;



public class ProductMapper {

    public static ProductOutputDTO createFrom (Product product) {

        return ProductOutputDTO
                .builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .build();
    }
}
