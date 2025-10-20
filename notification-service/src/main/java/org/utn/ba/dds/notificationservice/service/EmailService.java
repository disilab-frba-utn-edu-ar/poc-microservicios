package org.utn.ba.dds.notificationservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.utn.ba.dds.notificationservice.dto.EmailDetails;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService implements IEmailService {

  private final JavaMailSender mailSender;

  @Value("${mail.from:noreply@example.com}")
  private String defaultFrom;

  @Override
  public void sendEmail(EmailDetails details) {
    if (details == null || details.getTo() == null || details.getTo().isBlank()) {
      log.warn("Attempted to send email with invalid details: {}", details);
      return;
    }

    MimeMessage mimeMessage = mailSender.createMimeMessage();

    try {
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

      if (defaultFrom != null && !defaultFrom.isBlank()) {
        helper.setFrom(defaultFrom);
      }
      helper.setTo(details.getTo());
      helper.setSubject(details.getSubject());
      helper.setText(details.getBody(), true);

      mailSender.send(mimeMessage);
      log.info("Email sent to {} with subject '{}'", details.getTo(), details.getSubject());

    } catch (MessagingException e) {
      log.error("Failed to send email to {}: {}", details.getTo(), e.getMessage(), e);
      throw new RuntimeException("Failed to send email", e);
    }
  }
}