package org.utn.ba.order.services.imp;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.utn.ba.order.services.IOrderService;

@Service
@Slf4j
public class StripeWebhookService {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private IOrderService orderService;

    public void processWebhook(String payload, String sigHeader) throws SignatureVerificationException {
        Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = null;
                try {
                    session = (Session) event.getDataObjectDeserializer().deserializeUnsafe();
                } catch (Exception e) {
                    log.error("Failed to deserialize session: {}", e.getMessage());
                }
                
                if (session != null && session.getClientReferenceId() != null) {
                    Long orderId = Long.parseLong(session.getClientReferenceId());
                    log.info("✅ Payment successful webhook received for Order ID: {}", orderId);
                    orderService.confirmPayment(orderId);
                } else {
                    log.warn("⚠️ Received checkout.session.completed but session or clientReferenceId is null");
                }
                break;
            case "checkout.session.expired":
            case "checkout.session.async_payment_failed":
                Session failedSession = null;
                try {
                    failedSession = (Session) event.getDataObjectDeserializer().deserializeUnsafe();
                } catch (Exception e) {
                    log.error("Failed to deserialize failed session: {}", e.getMessage());
                }
                
                if (failedSession != null && failedSession.getClientReferenceId() != null) {
                    Long orderId = Long.parseLong(failedSession.getClientReferenceId());
                    log.info("Payment failed or expired for Order ID: {}", orderId);
                    orderService.cancelOrder(orderId);
                } else {
                    log.warn("⚠️ Received checkout session failed event but session or clientReferenceId is null");
                }
                break;
            default:
                log.info("Unhandled event type: {}", event.getType());
                break;
        }
    }
}
