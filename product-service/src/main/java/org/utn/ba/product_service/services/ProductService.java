package org.utn.ba.product_service.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.utn.ba.product_service.dto.ProductInputDTO;
import org.utn.ba.product_service.dto.ProductOutputDTO;
import org.utn.ba.product_service.mappers.ProductMapper;
import org.utn.ba.product_service.models.entities.Product;
import org.utn.ba.product_service.models.repositories.ProductRepository;

import java.util.List;

@Service
public class ProductService implements IProductService{

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductOutputDTO> findAll() {
        return this.productRepository.findAll().stream().map(ProductMapper::createFrom).toList();
    }

    @Override
    public ProductOutputDTO findById(Long id) {
        return this.productRepository.findById(id).map(ProductMapper:: createFrom).orElse(null);
    }

    @Override
    public Long createProduct(ProductInputDTO product) {
        Product newProduct = new ObjectMapper().convertValue(product, Product.class);
        this.productRepository.save(newProduct);
        return newProduct.getId();    }
}
