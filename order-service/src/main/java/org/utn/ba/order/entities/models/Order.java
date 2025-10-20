package org.utn.ba.order.entities.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Table(name="`order`")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDate date;

    @Column
    private Float finalPrice;

    @Embedded
    private UserDetails userDetails;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

    public void addOrderItem(OrderItem item) {
        this.orderItems.add(item);
        item.setOrder(this); // OJO con esto por la relacion bidireccinoal en hibernate
    }

    public void calculateFinalPrice() {
        double sum = this.orderItems.stream()
            .mapToDouble(item -> item.getPrice() * item.getAmount())
            .sum();
        this.finalPrice = (float) sum;
    }
}
