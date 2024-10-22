package org.utn.ba.product.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.utn.ba.product.models.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
