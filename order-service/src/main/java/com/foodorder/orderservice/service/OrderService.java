package com.foodorder.orderservice.service;

import com.foodorder.orderservice.dto.OrderRequest;
import com.foodorder.orderservice.dto.OrderResponse;
import com.foodorder.orderservice.dto.OrderCreatedEvent;
import com.foodorder.orderservice.exception.ResourceNotFoundException;
import com.foodorder.orderservice.model.Order;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.repository.OrderRepository;
import com.foodorder.orderservice.service.messaging.OrderEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderWorkflowService orderWorkflowService;
    private final OrderEventProducer orderEventProducer;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        log.info("Creating order for customer: {}", request.getCustomerName());

        // 1. Map request DTO to Order Entity
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .item(request.getItem())
                .amount(request.getAmount())
                .status(OrderStatus.PLACED)
                .build();

        // 2. Delegate workflow startup (which will save the entity and trigger Camunda)
        Order savedOrder = orderWorkflowService.startOrderWorkflow(order);

        // 3. Map response
        OrderResponse response = mapToResponse(savedOrder);
        
        // 4. Map and publish event using the dedicated producer
        OrderCreatedEvent createdEvent = OrderCreatedEvent.builder()
                .orderId(savedOrder.getId())
                .customerName(savedOrder.getCustomerName())
                .item(savedOrder.getItem())
                .amount(savedOrder.getAmount())
                .status(savedOrder.getStatus().name())
                .createdAt(savedOrder.getCreatedAt())
                .build();

        orderEventProducer.sendOrderCreatedEvent(createdEvent);

        return response;
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .item(order.getItem())
                .amount(order.getAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
