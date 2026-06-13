package com.foodorder.deliveryservice.service;

import com.foodorder.deliveryservice.dto.OrderEvent;
import com.foodorder.deliveryservice.dto.DeliveryRequest;
import com.foodorder.deliveryservice.dto.DeliveryResponse;
import com.foodorder.deliveryservice.model.Delivery;
import com.foodorder.deliveryservice.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final JmsTemplate jmsTemplate;

    // 1. Process delivery from HTTP REST requests
    @Transactional
    public DeliveryResponse processDeliveryRest(DeliveryRequest request) {
        // Log exactly as requested to System.out / console
        System.out.println("[DeliveryService] Order #" + request.getOrderId() + " - DELIVERED");

        Delivery delivery = Delivery.builder()
                .orderId(request.getOrderId())
                .courierName("Rider John Doe")
                .status("DELIVERED")
                .assignedAt(LocalDateTime.now())
                .deliveredAt(LocalDateTime.now())
                .build();

        Delivery savedDelivery = deliveryRepository.save(delivery);
        
        // Publish response so order-service updates state
        publishResponse(savedDelivery, "DELIVERED");

        return mapToResponse(savedDelivery);
    }

    // 2. Process delivery from JMS Queue requests
    @Transactional
    public void processDeliveryJms(OrderEvent event) {
        // Log exactly as requested to System.out / console
        System.out.println("[DeliveryService] Order #" + event.getOrderId() + " - DELIVERED");

        Delivery delivery = Delivery.builder()
                .orderId(event.getOrderId())
                .courierName("Rider John Doe")
                .status("DELIVERED")
                .assignedAt(LocalDateTime.now())
                .deliveredAt(LocalDateTime.now())
                .build();

        Delivery savedDelivery = deliveryRepository.save(delivery);

        publishResponse(savedDelivery, "DELIVERED");
    }

    @Transactional
    public Delivery assignDelivery(OrderEvent event) {
        log.info("Assigning delivery for orderId: {}", event.getOrderId());

        Delivery delivery = Delivery.builder()
                .orderId(event.getOrderId())
                .courierName("Rider John Doe")
                .status("ASSIGNED")
                .assignedAt(LocalDateTime.now())
                .build();

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery startDelivery(Long id) {
        log.info("Starting delivery for delivery ID: {}", id);
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + id));

        delivery.setStatus("OUT_FOR_DELIVERY");
        Delivery savedDelivery = deliveryRepository.save(delivery);

        publishResponse(savedDelivery, "OUT_FOR_DELIVERY");

        return savedDelivery;
    }

    @Transactional
    public Delivery completeDelivery(Long id) {
        log.info("Completing delivery for delivery ID: {}", id);
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + id));

        // Log exactly as requested to System.out / console
        System.out.println("[DeliveryService] Order #" + delivery.getOrderId() + " - DELIVERED");

        delivery.setStatus("DELIVERED");
        delivery.setDeliveredAt(LocalDateTime.now());
        Delivery savedDelivery = deliveryRepository.save(delivery);

        publishResponse(savedDelivery, "DELIVERED");

        return savedDelivery;
    }

    private void publishResponse(Delivery delivery, String status) {
        OrderEvent event = OrderEvent.builder()
                .orderId(delivery.getOrderId())
                .status(status)
                .build();

        jmsTemplate.convertAndSend("delivery-responses", event);
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrderId())
                .courierName(delivery.getCourierName())
                .status(delivery.getStatus())
                .assignedAt(delivery.getAssignedAt())
                .deliveredAt(delivery.getDeliveredAt())
                .createdAt(delivery.getCreatedAt())
                .build();
    }
}
