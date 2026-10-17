package org.utn.ba.order.services;

import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.dto.UserDetailsDTO;
import java.util.List;
import org.utn.ba.order.dto.CheckoutRequestDTO;

public interface IOrderService {
    List<OrderOutputDTO>  findAll();
    OrderOutputDTO findById(Long id);
    OrderOutputDTO createOrder(UserDetailsDTO userDetailsDTO, CheckoutRequestDTO requestDTO);

    void confirmPayment(Long orderId);

    void cancelOrder(Long orderId);
    
    OrderOutputDTO findByStripeSessionIdForUser(String sessionId, String userId);
}
