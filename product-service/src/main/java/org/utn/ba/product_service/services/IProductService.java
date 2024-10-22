package org.utn.ba.product_service.services;

import org.utn.ba.product_service.dto.ProductInputDTO;
import org.utn.ba.product_service.dto.ProductOutputDTO;

import java.util.List;

public interface IProductService {

    List<ProductOutputDTO> findAll();
    ProductOutputDTO findById(Long id);
    Long createProduct(ProductInputDTO product);
}
