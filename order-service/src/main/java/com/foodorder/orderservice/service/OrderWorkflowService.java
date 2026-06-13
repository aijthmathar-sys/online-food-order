package com.foodorder.orderservice.service;

import com.foodorder.orderservice.model.Order;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderWorkflowService {

    private final RuntimeService runtimeService;
    private final OrderRepository orderRepository;

    @Transactional
    public Order startOrderWorkflow(Order order) {
        order.setStatus(OrderStatus.PLACED);
        Order savedOrder = orderRepository.save(order);

        System.out.println("[OrderService] Order #" + savedOrder.getId() + " - PLACED");

        Map<String, Object> variables = new HashMap<>();
        variables.put("orderId", savedOrder.getId());
        variables.put("customerName", savedOrder.getCustomerName());
        variables.put("totalAmount", savedOrder.getAmount());
        variables.put("items", savedOrder.getItem());

        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(
                "order-processing", 
                savedOrder.getId().toString(), 
                variables
        );

        savedOrder.setProcessInstanceId(processInstance.getId());
        savedOrder.setStatus(OrderStatus.PLACED);
        return orderRepository.save(savedOrder);
    }

    @Transactional
    public void correlatePaymentResponse(Long orderId, boolean success) {
        log.info("Correlating payment response for order {}: success={}", orderId, success);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        if (success) {
            order.setStatus(OrderStatus.PAYMENT_SUCCESS);
        } else {
            order.setStatus(OrderStatus.PAYMENT_FAILED);
        }
        orderRepository.save(order);

        // Always correlate payment completed, providing the decision variable
        try {
            boolean hasSubscription = runtimeService.createExecutionQuery()
                    .processInstanceBusinessKey(orderId.toString())
                    .messageEventSubscriptionName("PaymentCompletedMessage")
                    .count() > 0;
            if (hasSubscription) {
                runtimeService.createMessageCorrelation("PaymentCompletedMessage")
                        .processInstanceBusinessKey(orderId.toString())
                        .setVariable("paymentSuccess", success)
                        .correlate();
            } else {
                log.info("No subscription found for PaymentCompletedMessage for order {}", orderId);
            }
        } catch (Exception e) {
            log.warn("Could not correlate PaymentCompletedMessage for order {}: {}", orderId, e.getMessage());
        }
    }

    @Transactional
    public void correlateKitchenResponse(Long orderId, String status) {
        log.info("Correlating kitchen response for order {}: status={}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if ("PREPARING".equals(status)) {
            // Under new lifecycle, main order status remains PAYMENT_SUCCESS during cooking
        } else if ("READY_FOR_DELIVERY".equals(status) || "READY".equals(status)) {
            order.setStatus(OrderStatus.READY);
            orderRepository.save(order);
            try {
                boolean hasSubscription = runtimeService.createExecutionQuery()
                        .processInstanceBusinessKey(orderId.toString())
                        .messageEventSubscriptionName("KitchenCompletedMessage")
                        .count() > 0;
                if (hasSubscription) {
                    runtimeService.createMessageCorrelation("KitchenCompletedMessage")
                            .processInstanceBusinessKey(orderId.toString())
                            .correlate();
                } else {
                    log.info("No subscription found for KitchenCompletedMessage for order {}", orderId);
                }
            } catch (Exception e) {
                log.warn("Could not correlate KitchenCompletedMessage for order {}: {}", orderId, e.getMessage());
            }
            return;
        }
        orderRepository.save(order);
    }

    @Transactional
    public void correlateDeliveryResponse(Long orderId, String status) {
        log.info("Correlating delivery response for order {}: status={}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if ("OUT_FOR_DELIVERY".equals(status)) {
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        } else if ("DELIVERED".equals(status)) {
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
            try {
                boolean hasSubscription = runtimeService.createExecutionQuery()
                        .processInstanceBusinessKey(orderId.toString())
                        .messageEventSubscriptionName("DeliveryCompletedMessage")
                        .count() > 0;
                if (hasSubscription) {
                    runtimeService.createMessageCorrelation("DeliveryCompletedMessage")
                            .processInstanceBusinessKey(orderId.toString())
                            .correlate();
                } else {
                    log.info("No subscription found for DeliveryCompletedMessage for order {}", orderId);
                }
            } catch (Exception e) {
                log.warn("Could not correlate DeliveryCompletedMessage for order {}: {}", orderId, e.getMessage());
            }
            return;
        }
        orderRepository.save(order);
    }
}
