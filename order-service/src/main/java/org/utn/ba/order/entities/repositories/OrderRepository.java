package org.utn.ba.order.entities.repositories.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.utn.ba.order.entities.models.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

}
