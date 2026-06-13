package com.foodorder.paymentservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long orderId;
    private Double amount;
    private String status;
    private String transactionId;
    private LocalDateTime createdAt;
}
