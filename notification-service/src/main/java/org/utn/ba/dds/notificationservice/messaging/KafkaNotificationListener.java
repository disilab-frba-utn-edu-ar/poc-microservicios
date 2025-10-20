package org.utn.ba.dds.notificationservice.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.utn.ba.dds.notificationservice.dto.EmailDetails;
import org.utn.ba.dds.notificationservice.service.IEmailService;
import org.utn.ba.events.OrderConfirmationEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaNotificationListener {

    private final IEmailService emailService;
    private final TemplateEngine templateEngine;
    @KafkaListener(topics = "#{'${kafka.topic.order-confirmations:order-confirmations}'}", groupId = "notification-group")
    public void handleOrderConfirmation(OrderConfirmationEvent event) {
        log.info("Received order confirmation event for order ID: {}", event.orderId());
        try {
            Context context = new Context();
            context.setVariable("orderId", event.orderId());
            context.setVariable("firstName", event.firstName());
            context.setVariable("orderDate", event.orderDate());
            context.setVariable("items", event.items());
            context.setVariable("finalPrice", event.finalPrice());

            String htmlBody = templateEngine.process("order-confirmation", context);

            String subject = "Your Order #" + event.orderId() + " Confirmation";
            EmailDetails email = EmailDetails.builder()
                .to(event.userEmail())
                .subject(subject)
                .body(htmlBody)
                .build();

            emailService.sendEmail(email);

            log.info("Confirmation email sent successfully to {}", event.userEmail());
        } catch (Exception e) {
            log.error("Error processing Kafka message for order {}: {}", event.orderId(), e.getMessage(), e);
        }
    }
}