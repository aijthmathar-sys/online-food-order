package com.foodorder.kitchenservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KitchenRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    private String items;
}
