package org.utn.ba.cartservice.entities.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.utn.ba.cartservice.exceptions.ItemNotFoundInCartException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Document(collection = "shopping_carts")
@Getter
@Setter
@NoArgsConstructor
public class ShoppingCart {
  @Id
  String usedId; // The 'sub' claim from the Auth0 JWT

  private List<CartItem> items = new ArrayList<>();

  private Instant lastModifiedDate;

  public ShoppingCart(String usedId) {
    this.usedId = usedId;
  }

  public void addItem(CartItem newItem) {
    findItemByProductId(newItem.getProductId())
        .ifPresentOrElse(
            existingItem -> existingItem.setAmount(existingItem.getAmount() + newItem.getAmount()),
            () -> this.items.add(newItem)
        );
    this.lastModifiedDate = Instant.now();
  }

  public void updateItemAmount(Long productId, int newAmount) {
    CartItem itemToUpdate = findItemByProductId(productId)
        .orElseThrow(() -> new ItemNotFoundInCartException(productId));

    if (newAmount > 0) {
      itemToUpdate.setAmount(newAmount);
    } else {
      this.items.remove(itemToUpdate);
    }
    this.lastModifiedDate = Instant.now();
  }

  public void removeItem(Long productId) {
    boolean removed = this.items.removeIf(item -> item.getProductId().equals(productId));
    if (!removed) {
      throw new ItemNotFoundInCartException(productId);
    }
    this.lastModifiedDate = Instant.now();
  }

  public void clear() {
    this.items.clear();
    this.lastModifiedDate = Instant.now();
  }
  private Optional<CartItem> findItemByProductId(Long productId) {
    return this.items.stream()
        .filter(item -> item.getProductId().equals(productId))
        .findFirst();
  }
}
