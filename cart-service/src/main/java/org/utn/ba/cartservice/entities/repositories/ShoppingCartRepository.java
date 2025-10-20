package org.utn.ba.cartservice.entities.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.utn.ba.cartservice.entities.models.ShoppingCart;

@Repository
public interface ShoppingCartRepository extends MongoRepository<ShoppingCart,String> {
}
