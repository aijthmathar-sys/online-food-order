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

@Component("sendToKitchenDelegate")
@RequiredArgsConstructor
@Slf4j
public class SendToKitchenDelegate implements JavaDelegate {

    private final RestTemplate restTemplate;
    private final OrderRepository orderRepository;

    private static final String KITCHEN_URL = "http://localhost:8083/api/kitchen/orders";

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        String items = (String) execution.getVariable("items");

        log.info("SendToKitchenDelegate: Requesting kitchen ticket for orderId: {}", orderId);

        Map<String, Object> request = new HashMap<>();
        request.put("orderId", orderId);
        request.put("items", items != null ? items : "Default Gourmet Item");

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(KITCHEN_URL, request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            String status = responseBody != null ? (String) responseBody.get("status") : "READY";
            log.info("SendToKitchenDelegate: Kitchen ticket created with status: {} for orderId: {}", status, orderId);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            order.setStatus(OrderStatus.READY);
            orderRepository.save(order);

        } catch (Exception e) {
            log.error("SendToKitchenDelegate: Kitchen API call failed for orderId: {}", orderId, e);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            throw new BpmnError("KITCHEN_FAILED", "Failed to communicate with Kitchen Service: " + e.getMessage());
        }
    }
}
