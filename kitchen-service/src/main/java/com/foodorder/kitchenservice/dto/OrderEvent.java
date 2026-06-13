package com.foodorder.kitchenservice.dto;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEvent implements Serializable {
    private Long orderId;
    private String processInstanceId;
    private String customerName;
    private Double amount;
    private String items;
    private String status;
}
