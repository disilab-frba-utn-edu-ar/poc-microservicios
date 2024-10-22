package org.utn.ba.orderservice.services;

import org.springframework.stereotype.Service;
import org.utn.ba.orderservice.dto.OrderInputDTO;
import org.utn.ba.orderservice.dto.OrderOutputDTO;

import java.util.List;

public interface IOrderService {

    List<OrderOutputDTO>  findAll();
    OrderOutputDTO findById(Long id);
    OrderOutputDTO createOrder(OrderInputDTO order);
}

