package com.foodorder.paymentservice.controller;

import com.foodorder.paymentservice.dto.PaymentRequest;
import com.foodorder.paymentservice.dto.PaymentResponse;
import com.foodorder.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPaymentRest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
