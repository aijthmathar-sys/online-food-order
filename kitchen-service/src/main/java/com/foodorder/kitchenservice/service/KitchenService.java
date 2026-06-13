package com.foodorder.kitchenservice.service;

import com.foodorder.kitchenservice.dto.OrderEvent;
import com.foodorder.kitchenservice.dto.KitchenRequest;
import com.foodorder.kitchenservice.dto.KitchenResponse;
import com.foodorder.kitchenservice.model.KitchenTicket;
import com.foodorder.kitchenservice.repository.KitchenTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class KitchenService {

    private final KitchenTicketRepository kitchenTicketRepository;
    private final JmsTemplate jmsTemplate;

    // 1. Process kitchen ticket from HTTP REST requests
    @Transactional
    public KitchenResponse createKitchenTicketRest(KitchenRequest request) {
        // Log exactly as requested to System.out / console
        System.out.println("[KitchenService] Order #" + request.getOrderId() + " - Food READY");

        KitchenTicket ticket = KitchenTicket.builder()
                .orderId(request.getOrderId())
                .items(request.getItems() != null ? request.getItems() : "Default Gourmet Item")
                .status("READY")
                .build();

        KitchenTicket savedTicket = kitchenTicketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    // 2. Process kitchen ticket from JMS Queue requests
    @Transactional
    public void processKitchenJms(OrderEvent event) {
        // Log exactly as requested to System.out / console
        System.out.println("[KitchenService] Order #" + event.getOrderId() + " - Food READY");

        KitchenTicket ticket = KitchenTicket.builder()
                .orderId(event.getOrderId())
                .items(event.getItems() != null ? event.getItems() : "Default Gourmet Item")
                .status("READY")
                .build();

        kitchenTicketRepository.save(ticket);

        OrderEvent responseEvent = OrderEvent.builder()
                .orderId(event.getOrderId())
                .items(event.getItems())
                .status("READY")
                .build();

        jmsTemplate.convertAndSend("kitchen-responses", responseEvent);
    }

    private KitchenResponse mapToResponse(KitchenTicket ticket) {
        return KitchenResponse.builder()
                .id(ticket.getId())
                .orderId(ticket.getOrderId())
                .items(ticket.getItems())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
