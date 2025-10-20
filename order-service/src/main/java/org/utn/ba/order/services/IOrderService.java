package org.utn.ba.order.services;

import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.dto.UserDetailsDTO;
import java.util.List;

public interface IOrderService {
    List<OrderOutputDTO>  findAll();
    OrderOutputDTO findById(Long id);
    OrderOutputDTO createOrder(UserDetailsDTO userDetailsDTO);
}

