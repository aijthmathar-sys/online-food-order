package com.foodorder.orderservice.delegate;

import com.foodorder.orderservice.model.Order;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component("cancelOrderDelegate")
@RequiredArgsConstructor
@Slf4j
public class CancelOrderDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        log.warn("CancelOrderDelegate: Cancelling order with ID {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        log.info("Order ID {} has been cancelled in the database.", orderId);
    }
}
