package org.utn.ba.order.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.utn.ba.order.client.dto.ProductOutputDTO;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping(value ="/products/{id}", consumes = "application/json", produces = "application/json")
    ResponseEntity<ProductOutputDTO> getProductById(@PathVariable("id") Long id);
}