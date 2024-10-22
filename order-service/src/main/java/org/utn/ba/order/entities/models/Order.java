package org.utn.ba.order.entities.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name="`order`")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDate date;

    @Column
    private Long productId;

    @Column
    private Integer amount;

    @Column
    private Float finalPrice;
}
