package org.utn.ba.order.services;

import org.utn.ba.order.dto.OrderInputDTO;
import org.utn.ba.order.dto.OrderOutputDTO;

import java.util.List;

public interface IOrderService {

    List<OrderOutputDTO>  findAll();
    OrderOutputDTO findById(Long id);
    OrderOutputDTO createOrder(OrderInputDTO order);
}

