package com.foodorder.orderservice.delegate;

import com.foodorder.orderservice.model.Order;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component("requestDeliveryDelegate")
@RequiredArgsConstructor
@Slf4j
public class RequestDeliveryDelegate implements JavaDelegate {

    private final RestTemplate restTemplate;
    private final OrderRepository orderRepository;

    private static final String DELIVERY_URL = "http://localhost:8084/api/deliveries";

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");

        log.info("RequestDeliveryDelegate: Requesting delivery dispatch for orderId: {}", orderId);

        Map<String, Object> request = new HashMap<>();
        request.put("orderId", orderId);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(DELIVERY_URL, request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            String status = responseBody != null ? (String) responseBody.get("status") : "DELIVERED";
            log.info("RequestDeliveryDelegate: Delivery status returned: {} for orderId: {}", status, orderId);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);

            System.out.println("[OrderService] Order #" + orderId + " - Workflow COMPLETE");

        } catch (Exception e) {
            log.error("RequestDeliveryDelegate: Delivery API call failed for orderId: {}", orderId, e);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            throw new BpmnError("DELIVERY_FAILED", "Failed to communicate with Delivery Service: " + e.getMessage());
        }
    }
}
