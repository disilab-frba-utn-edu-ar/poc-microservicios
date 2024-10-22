package org.utn.ba.orderservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.utn.ba.orderservice.client.dto.ProductOutputDTO;

@FeignClient(name = "product-service", url = "http://localhost:9811")
public interface ProductClient {

    @GetMapping(value ="/products/{id}", consumes = "application/json", produces = "application/json")
    ResponseEntity<ProductOutputDTO> getProductById(@PathVariable("id") Long id);
}