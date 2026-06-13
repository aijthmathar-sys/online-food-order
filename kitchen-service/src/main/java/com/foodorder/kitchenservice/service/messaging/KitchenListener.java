package com.foodorder.kitchenservice.service.messaging;

import com.foodorder.kitchenservice.dto.OrderEvent;
import com.foodorder.kitchenservice.service.KitchenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KitchenListener {

    private final KitchenService kitchenService;

    @JmsListener(destination = "kitchen-requests")
    public void receiveKitchenRequest(OrderEvent event) {
        log.info("Received kitchen request for orderId: {}", event.getOrderId());
        kitchenService.processKitchenJms(event);
    }
}
