package org.utn.ba.order.dto;

import lombok.Builder;

@Builder
public record UserDetailsDTO(String userId, String userEmail, String fullName, String firstName) {
}
