package org.utn.ba.dds.notificationservice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailDetails {
  private String to;
  private String subject;
  private String body;
}