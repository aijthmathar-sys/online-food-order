package com.foodorder.kitchenservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KitchenResponse {
    private Long id;
    private Long orderId;
    private String items;
    private String status;
    private LocalDateTime createdAt;
}
