package org.utn.ba.order.client.dto;

import lombok.Data;
import java.util.List;

@Data
public class ShoppingCartOutputDTO {
  private List<CartItemOutputDTO> items;
}
