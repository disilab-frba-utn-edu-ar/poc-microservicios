package org.utn.ba.order.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.utn.ba.order.dto.OrderInputDTO;
import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.services.IOrderService;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderOutputDTO>> getAllOrders() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderOutputDTO> getOrderById(@PathVariable Long id) {

        OrderOutputDTO orderOutputDTO = this.orderService.findById(id);
        if (orderOutputDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(orderOutputDTO);
    }

    @PostMapping
    public ResponseEntity<OrderOutputDTO> createOrder(@RequestBody OrderInputDTO order) {

        return ResponseEntity.status(HttpStatus.CREATED).body(this.orderService.createOrder(order));
    }

}