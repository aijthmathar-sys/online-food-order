# Low-Level Design (LLD) - REST API Documentation

This document describes the REST API endpoints exposed by the Gourmet Express microservices.

---

## 1. Order Service (Port 8081)

The Order Service handles the creation, retrieval, and status tracking of customer orders. It serves as the entry point for the React UI and hosts the Camunda workflow engine.

### Create Order
* **Endpoint**: `POST /api/orders`
* **Content-Type**: `application/json`
* **Request Body**:
```json
{
  "customerName": "Jane Doe",
  "item": "[The Grand Taj Hotel] Special Mutton Biryani x2, Garlic Butter Naan x1",
  "amount": 620.00
}
```
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "customerName": "Jane Doe",
  "item": "[The Grand Taj Hotel] Special Mutton Biryani x2, Garlic Butter Naan x1",
  "amount": 620.00,
  "status": "PLACED",
  "processInstanceId": "e305e94b-4bda-11ed-bdc3-0242ac120002",
  "createdAt": "2026-06-13T12:40:00.000+00:00",
  "updatedAt": "2026-06-13T12:40:00.000+00:00"
}
```

### Get All Orders
* **Endpoint**: `GET /api/orders`
* **Response Body (`200 OK`)**:
```json
[
  {
    "id": 1,
    "customerName": "Jane Doe",
    "item": "[The Grand Taj Hotel] Special Mutton Biryani x2, Garlic Butter Naan x1",
    "amount": 620.00,
    "status": "PLACED",
    "processInstanceId": "e305e94b-4bda-11ed-bdc3-0242ac120002",
    "createdAt": "2026-06-13T12:40:00.000+00:00",
    "updatedAt": "2026-06-13T12:40:00.000+00:00"
  }
]
```

### Get Order by ID
* **Endpoint**: `GET /api/orders/{id}`
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "customerName": "Jane Doe",
  "item": "[The Grand Taj Hotel] Special Mutton Biryani x2, Garlic Butter Naan x1",
  "amount": 620.00,
  "status": "DELIVERED",
  "processInstanceId": "e305e94b-4bda-11ed-bdc3-0242ac120002",
  "createdAt": "2026-06-13T12:40:00.000+00:00",
  "updatedAt": "2026-06-13T12:45:00.000+00:00"
}
```

---

## 2. Kitchen Service (Port 8083)

The Kitchen Service manages tickets for the restaurant chefs to prepare food.

### Get Kitchen Tickets
* **Endpoint**: `GET /api/kitchen/orders`
* **Response Body (`200 OK`)**:
```json
[
  {
    "id": 1,
    "orderId": 1,
    "items": "Special Mutton Biryani x2, Garlic Butter Naan x1",
    "status": "RECEIVED",
    "createdAt": "2026-06-13T12:41:00.000+00:00"
  }
]
```

### Start Preparing Order
* **Endpoint**: `PUT /api/kitchen/orders/{id}/prepare`
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "orderId": 1,
  "items": "Special Mutton Biryani x2, Garlic Butter Naan x1",
  "status": "PREPARING",
  "createdAt": "2026-06-13T12:41:00.000+00:00"
}
```

### Mark Order as Ready
* **Endpoint**: `PUT /api/kitchen/orders/{id}/ready`
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "orderId": 1,
  "items": "Special Mutton Biryani x2, Garlic Butter Naan x1",
  "status": "READY",
  "createdAt": "2026-06-13T12:41:00.000+00:00"
}
```

---

## 3. Delivery Service (Port 8084)

The Delivery Service simulates the dispatch, routing, and tracking of couriers.

### Get Deliveries
* **Endpoint**: `GET /api/deliveries`
* **Response Body (`200 OK`)**:
```json
[
  {
    "id": 1,
    "orderId": 1,
    "courierName": "John Doe",
    "status": "ASSIGNED",
    "assignedAt": "2026-06-13T12:43:00.000+00:00",
    "deliveredAt": null,
    "createdAt": "2026-06-13T12:43:00.000+00:00"
  }
]
```

### Start Delivery (Rider Dispatched)
* **Endpoint**: `PUT /api/deliveries/{id}/start`
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "orderId": 1,
  "courierName": "John Doe",
  "status": "OUT_FOR_DELIVERY",
  "assignedAt": "2026-06-13T12:43:00.000+00:00",
  "deliveredAt": null,
  "createdAt": "2026-06-13T12:43:00.000+00:00"
}
```

### Complete Delivery (Delivered to Customer)
* **Endpoint**: `PUT /api/deliveries/{id}/complete`
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "orderId": 1,
  "courierName": "John Doe",
  "status": "DELIVERED",
  "assignedAt": "2026-06-13T12:43:00.000+00:00",
  "deliveredAt": "2026-06-13T12:45:00.000+00:00",
  "createdAt": "2026-06-13T12:43:00.000+00:00"
}
```

---

## 4. Payment Service (Port 8082)

The Payment Service runs asynchronously via JMS and handles transaction logging.

### Get Payment Status
* **Endpoint**: `GET /api/payments/order/{orderId}`
* **Response Body (`200 OK`)**:
```json
{
  "id": 1,
  "orderId": 1,
  "amount": 620.00,
  "status": "SUCCESS",
  "transactionId": "TXN_7813356643",
  "createdAt": "2026-06-13T12:40:30.000+00:00"
}
```
