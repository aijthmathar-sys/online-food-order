package com.foodorder.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryResponse {
    private Long id;
    private Long orderId;
    private String courierName;
    private String status;
    private LocalDateTime assignedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
}
