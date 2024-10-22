package org.utn.ba.product.services;

import org.utn.ba.product.dto.ProductInputDTO;
import org.utn.ba.product.dto.ProductOutputDTO;

import java.util.List;

public interface IProductService {

    List<ProductOutputDTO> findAll();
    ProductOutputDTO findById(Long id);
    Long createProduct(ProductInputDTO product);
}
