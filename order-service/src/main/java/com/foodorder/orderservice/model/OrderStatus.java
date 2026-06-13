package com.foodorder.orderservice.model;

public enum OrderStatus {
    PLACED,
    PAYMENT_SUCCESS,
    PAYMENT_FAILED,
    READY,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}
