package com.foodorder.orderservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String customerName;
    private String item;
    private Double amount;
    private String status;
    private LocalDateTime createdAt;
}
