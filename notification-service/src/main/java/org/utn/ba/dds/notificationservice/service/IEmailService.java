package org.utn.ba.dds.notificationservice.service;

import org.utn.ba.dds.notificationservice.dto.EmailDetails;

public interface IEmailService {
  void sendEmail(EmailDetails details);
}
