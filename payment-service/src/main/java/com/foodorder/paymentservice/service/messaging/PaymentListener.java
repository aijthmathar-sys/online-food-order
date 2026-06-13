package com.foodorder.paymentservice.service.messaging;

import com.foodorder.paymentservice.dto.OrderEvent;
import com.foodorder.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentListener {

    private final PaymentService paymentService;

    @JmsListener(destination = "payment-requests")
    public void receivePaymentRequest(OrderEvent event) {
        log.info("Received payment request for orderId: {}", event.getOrderId());
        paymentService.processPaymentJms(event);
    }
}
