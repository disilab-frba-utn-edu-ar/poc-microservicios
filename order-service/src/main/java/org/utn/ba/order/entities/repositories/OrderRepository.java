package org.utn.ba.order.entities.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.utn.ba.order.entities.models.Order;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByStripeSessionIdAndUserDetails_UserId(String stripeSessionId, String userId);
}
