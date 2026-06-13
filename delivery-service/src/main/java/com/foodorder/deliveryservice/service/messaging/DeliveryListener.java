package com.foodorder.deliveryservice.service.messaging;

import com.foodorder.deliveryservice.dto.OrderEvent;
import com.foodorder.deliveryservice.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryListener {

    private final DeliveryService deliveryService;

    @JmsListener(destination = "delivery-requests")
    public void receiveDeliveryRequest(OrderEvent event) {
        log.info("Received delivery request for orderId: {}", event.getOrderId());
        deliveryService.processDeliveryJms(event);
    }
}
