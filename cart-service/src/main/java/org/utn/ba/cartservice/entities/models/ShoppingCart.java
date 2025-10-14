package org.utn.ba.cartservice.entities.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "shopping_carts")
@Getter
@Setter
@NoArgsConstructor
public class ShoppingCart {
  @Id
  String usedId; // The 'sub' claim from the Auth0 JWT

  private List<CartItem> items = new ArrayList<>();

  private Instant lastModifiedDate;
}
