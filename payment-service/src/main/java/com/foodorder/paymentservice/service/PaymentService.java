package com.foodorder.paymentservice.service;

import com.foodorder.paymentservice.dto.OrderEvent;
import com.foodorder.paymentservice.dto.PaymentRequest;
import com.foodorder.paymentservice.dto.PaymentResponse;
import com.foodorder.paymentservice.model.Payment;
import com.foodorder.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final JmsTemplate jmsTemplate;
    private final Random random = new Random();

    // 1. Process payment from HTTP REST requests
    @Transactional
    public PaymentResponse processPaymentRest(PaymentRequest request) {
        // Decide SUCCESS or FAILED (80% SUCCESS rate)
        boolean isSuccess = random.nextDouble() < 0.8;
        String status = isSuccess ? "SUCCESS" : "FAILED";

        // Log exactly as requested to System.out / console
        if (isSuccess) {
            System.out.println("[PaymentService] Order #" + request.getOrderId() + " - Payment SUCCESS");
        } else {
            System.out.println("[PaymentService] Order #" + request.getOrderId() + " - Payment FAILED");
        }

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .status(status)
                .transactionId(UUID.randomUUID().toString())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    // 2. Process payment from JMS Queue requests
    @Transactional
    public void processPaymentJms(OrderEvent event) {
        // Decide SUCCESS or FAILED (80% SUCCESS rate)
        boolean isSuccess = random.nextDouble() < 0.8;
        String status = isSuccess ? "SUCCESS" : "FAILED";

        // Log exactly as requested to System.out / console
        if (isSuccess) {
            System.out.println("[PaymentService] Order #" + event.getOrderId() + " - Payment SUCCESS");
        } else {
            System.out.println("[PaymentService] Order #" + event.getOrderId() + " - Payment FAILED");
        }

        Payment payment = Payment.builder()
                .orderId(event.getOrderId())
                .amount(event.getAmount())
                .status(status)
                .transactionId(UUID.randomUUID().toString())
                .build();

        paymentRepository.save(payment);

        // Map event status to PAYMENT_SUCCESS or PAYMENT_FAILED
        String eventStatus = isSuccess ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED";

        OrderEvent responseEvent = OrderEvent.builder()
                .orderId(event.getOrderId())
                .processInstanceId(event.getProcessInstanceId())
                .customerName(event.getCustomerName())
                .amount(event.getAmount())
                .items(event.getItems())
                .status(eventStatus)
                .build();

        jmsTemplate.convertAndSend("payment-responses", responseEvent);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
