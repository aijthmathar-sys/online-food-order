package com.foodorder.orderservice.delegate;

import com.foodorder.orderservice.model.Order;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component("processPaymentDelegate")
@RequiredArgsConstructor
@Slf4j
public class ProcessPaymentDelegate implements JavaDelegate {

    private final RestTemplate restTemplate;
    private final OrderRepository orderRepository;
    
    private static final String PAYMENT_URL = "http://localhost:8082/api/payments";

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        Double totalAmount = (Double) execution.getVariable("totalAmount");

        log.info("ProcessPaymentDelegate: Initiating payment for orderId: {}", orderId);

        Map<String, Object> request = new HashMap<>();
        request.put("orderId", orderId);
        request.put("amount", totalAmount);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(PAYMENT_URL, request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            String status = responseBody != null ? (String) responseBody.get("status") : "FAILED";
            boolean isSuccess = "SUCCESS".equalsIgnoreCase(status);

            log.info("ProcessPaymentDelegate: Payment response for orderId: {} status: {}", orderId, status);

            execution.setVariable("paymentSuccess", isSuccess);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            
            if (isSuccess) {
                order.setStatus(OrderStatus.PAYMENT_SUCCESS);
            } else {
                order.setStatus(OrderStatus.PAYMENT_FAILED);
            }
            orderRepository.save(order);

        } catch (Exception e) {
            log.error("ProcessPaymentDelegate: Payment API call failed for orderId: {}", orderId, e);
            execution.setVariable("paymentSuccess", false);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            orderRepository.save(order);
        }
    }
}
