package org.utn.ba.order.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.utn.ba.order.dto.OrderOutputDTO;
import org.utn.ba.order.dto.UserDetailsDTO;
import org.utn.ba.order.entities.models.UserDetails;
import org.utn.ba.order.services.IOrderService;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @Value("${auth0.claims.email}")
    private String emailClaimName;

    @Value("${auth0.claims.name}")
    private String nameClaimName;

    @Value("${auth0.claims.given-name}")
    private String givenNameClaims;

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
    public ResponseEntity<OrderOutputDTO> createOrder(@AuthenticationPrincipal Jwt jwt) {

        String userId = jwt.getSubject();
        String userEmail = jwt.getClaimAsString(emailClaimName);
        String userFullName = jwt.getClaimAsString(nameClaimName);
        String userGivenName = jwt.getClaimAsString(givenNameClaims);

        UserDetailsDTO userDetails = UserDetailsDTO.builder()
            .userId(userId)
            .userEmail(userEmail)
            .fullName(userFullName)
            .firstName(userGivenName)
            .build();

        OrderOutputDTO createdOrder = orderService.createOrder(userDetails);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

}