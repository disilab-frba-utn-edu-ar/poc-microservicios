package org.utn.ba.order.entities.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class UserDetails {
  private String userId;
  private String userEmail;
  private String fullName;
  private String firstName;
}
