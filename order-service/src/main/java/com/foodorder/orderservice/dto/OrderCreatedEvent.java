package com.foodorder.orderservice.dto;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreatedEvent implements Serializable {
    private Long orderId;
    private String customerName;
    private String item;
    private Double amount;
    private String status;
    private LocalDateTime createdAt;
}
