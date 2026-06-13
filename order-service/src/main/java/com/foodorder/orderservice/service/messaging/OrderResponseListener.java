package com.foodorder.orderservice.service.messaging;

import com.foodorder.orderservice.dto.OrderEvent;
import com.foodorder.orderservice.service.OrderWorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderResponseListener {

    private final OrderWorkflowService orderWorkflowService;

    @JmsListener(destination = "payment-responses")
    public void receivePaymentResponse(OrderEvent event) {
        log.info("Received payment response for order {}: status={}", event.getOrderId(), event.getStatus());
        boolean success = "PAYMENT_SUCCESS".equals(event.getStatus());
        orderWorkflowService.correlatePaymentResponse(event.getOrderId(), success);
    }

    @JmsListener(destination = "kitchen-responses")
    public void receiveKitchenResponse(OrderEvent event) {
        log.info("Received kitchen response for order {}: status={}", event.getOrderId(), event.getStatus());
        orderWorkflowService.correlateKitchenResponse(event.getOrderId(), event.getStatus());
    }

    @JmsListener(destination = "delivery-responses")
    public void receiveDeliveryResponse(OrderEvent event) {
        log.info("Received delivery response for order {}: status={}", event.getOrderId(), event.getStatus());
        orderWorkflowService.correlateDeliveryResponse(event.getOrderId(), event.getStatus());
    }
}
