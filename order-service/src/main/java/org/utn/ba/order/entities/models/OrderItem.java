package org.utn.ba.order.entities.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "`order_items`")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long productId;
  private Integer amount;
  private Float price;
  private String productName;
  private String imageUrl;

  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order;
}