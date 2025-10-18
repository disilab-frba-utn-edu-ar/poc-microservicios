package org.utn.ba.order.mappers;

import org.utn.ba.order.dto.UserDetailsDTO;
import org.utn.ba.order.entities.models.UserDetails;

public class UserDetailsMapper {
  public static UserDetailsDTO createFrom(UserDetails userDetails) {

    return UserDetailsDTO.builder()
        .userId(userDetails.getUserId())
        .userEmail(userDetails.getUserEmail())
        .fullName(userDetails.getFullName())
        .firstName(userDetails.getFirstName())
        .build();
  }

  public static UserDetails createFrom(UserDetailsDTO dto) {

    return UserDetails.builder()
        .userId(dto.userId())
        .userEmail(dto.userEmail())
        .fullName(dto.fullName())
        .firstName(dto.firstName())
        .build();
  }
}
