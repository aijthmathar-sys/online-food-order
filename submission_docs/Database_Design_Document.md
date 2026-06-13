# Database Design Document

This document details the database schema design, table fields, types, indexes, and architectural details for the microservices in the Gourmet Express system.

---

## 🏗️ Microservice Database Isolation Strategy
To maintain microservice autonomy and loose coupling, the project implements a **Database-per-Service** design pattern. Four separate logical databases represent physical boundaries:
1. **`order_db`**: Handles order records and the Camunda engine's internal tracking tables.
2. **`payment_db`**: Stores payment transactions.
3. **`kitchen_db`**: Tracks kitchen ticket status.
4. **`delivery_db`**: Manages courier assignations and delivery progress.

---

## 🗄️ Tables and Fields

### 1. Database: `order_db` | Table: `orders`
Stores order details, transaction status, and correlates them with the running Camunda workflow instance.

| Column Name | Data Type | Key/Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY (AUTO_INCREMENT)` | Unique identifier for each order. |
| `customer_name` | `VARCHAR(255)` | `NOT NULL` | Name of the customer who ordered. |
| `items` | `TEXT` | `NOT NULL` | Serialized item listing and quantities. |
| `total_amount` | `DECIMAL(10, 2)` | `NOT NULL` | Grand total in Rupees. |
| `status` | `VARCHAR(50)` | `NOT NULL` | Current state of order (see check constraint). |
| `process_instance_id`| `VARCHAR(255)`| `NULL` | ID of the linked Camunda process. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Time of placement. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE` | Last status modification time. |

* **Status Constraint**: `status` IN (`'PLACED'`, `'PAYMENT_SUCCESS'`, `'PAYMENT_FAILED'`, `'READY'`, `'OUT_FOR_DELIVERY'`, `'DELIVERED'`, `'CANCELLED'`)
* **Indexes**:
  * `idx_orders_status` on `status` (for rapid search on dashboard state).
  * `idx_orders_process_instance` on `process_instance_id` (for Camunda event correlation lookups).

---

### 2. Database: `payment_db` | Table: `payments`
Tracks transactions completed or rejected by the payment service.

| Column Name | Data Type | Key/Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY (AUTO_INCREMENT)` | Unique payment transaction ID. |
| `order_id` | `BIGINT` | `NOT NULL` | Logical reference to `order_db.orders(id)`. |
| `amount` | `DECIMAL(10, 2)` | `NOT NULL` | Sum authorized. |
| `status` | `VARCHAR(50)` | `NOT NULL` | `SUCCESS` or `FAILED`. |
| `transaction_id` | `VARCHAR(255)` | `NULL` | Reference ID returned by gateway (e.g. Razorpay). |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Transaction execution time. |

* **Indexes**:
  * `idx_payments_order_id` on `order_id` (for searching payments by order query).

---

### 3. Database: `kitchen_db` | Table: `kitchen_tickets`
Tracks the food preparation progress in the restaurant's kitchen.

| Column Name | Data Type | Key/Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY (AUTO_INCREMENT)` | Unique kitchen ticket ID. |
| `order_id` | `BIGINT` | `NOT NULL` | Logical reference to `order_db.orders(id)`. |
| `items` | `TEXT` | `NOT NULL` | The dish items to prepare. |
| `status` | `VARCHAR(50)` | `NOT NULL` | `RECEIVED`, `PREPARING`, `READY`. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Preparation ticket creation time. |

* **Indexes**:
  * `idx_kitchen_tickets_order_id` on `order_id` (to query kitchen tickets by order).

---

### 4. Database: `delivery_db` | Table: `deliveries`
Tracks the rider dispatch status and delivery timing.

| Column Name | Data Type | Key/Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY (AUTO_INCREMENT)` | Unique delivery record ID. |
| `order_id` | `BIGINT` | `NOT NULL` | Logical reference to `order_db.orders(id)`. |
| `courier_name` | `VARCHAR(255)` | `NULL` | Assigned courier name. |
| `status` | `VARCHAR(50)` | `NOT NULL` | `ASSIGNED`, `OUT_FOR_DELIVERY`, `DELIVERED`. |
| `assigned_at` | `TIMESTAMP` | `NULL` | Rider dispatch time. |
| `delivered_at` | `TIMESTAMP` | `NULL` | Final hand-off confirmation timestamp. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Log creation. |

* **Indexes**:
  * `idx_deliveries_order_id` on `order_id` (for rider location/status queries).
