package com.foodorder.orderservice.service.messaging;

import com.foodorder.orderservice.dto.OrderCreatedEvent;
import jakarta.jms.Queue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private final JmsTemplate jmsTemplate;
    private final Queue orderCreatedQueue;

    public void sendOrderCreatedEvent(OrderCreatedEvent event) {
        log.info("Sending OrderCreatedEvent for order ID {} to queue {}", event.getOrderId(), orderCreatedQueue);
        jmsTemplate.convertAndSend(orderCreatedQueue, event);
    }
}
