-- =============================================================================
-- MySQL Database Schema for Online Food Order Processing System
-- Compatible with MySQL 8.x and higher
-- =============================================================================

-- Create separate databases representing microservice boundaries
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS kitchen_db;
CREATE DATABASE IF NOT EXISTS delivery_db;

-- -----------------------------------------------------------------------------
-- 1. DATABASE: order_db | TABLE: orders
-- -----------------------------------------------------------------------------
USE order_db;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    items TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    process_instance_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT chk_order_status CHECK (
        status IN ('PLACED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_process_instance ON orders(process_instance_id);


-- -----------------------------------------------------------------------------
-- 2. DATABASE: payment_db | TABLE: payments
-- -----------------------------------------------------------------------------
USE payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT NOT NULL,
    order_id BIGINT NOT NULL,                  -- Logical Reference to order_db.orders(id)
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,               -- SUCCESS, FAILED
    transaction_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_payments PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);


-- -----------------------------------------------------------------------------
-- 3. DATABASE: kitchen_db | TABLE: kitchen_tickets
-- -----------------------------------------------------------------------------
USE kitchen_db;

CREATE TABLE IF NOT EXISTS kitchen_tickets (
    id BIGINT AUTO_INCREMENT NOT NULL,
    order_id BIGINT NOT NULL,                  -- Logical Reference to order_db.orders(id)
    items TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,               -- RECEIVED, PREPARING, READY
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_kitchen_tickets PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Indexes
CREATE INDEX idx_kitchen_tickets_order_id ON kitchen_tickets(order_id);


-- -----------------------------------------------------------------------------
-- 4. DATABASE: delivery_db | TABLE: deliveries
-- -----------------------------------------------------------------------------
USE delivery_db;

CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT NOT NULL,
    order_id BIGINT NOT NULL,                  -- Logical Reference to order_db.orders(id)
    courier_name VARCHAR(255) NULL,
    status VARCHAR(50) NOT NULL,               -- ASSIGNED, OUT_FOR_DELIVERY, DELIVERED
    assigned_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_deliveries PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Indexes
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);


-- =============================================================================
-- MONOLITHIC ALTERNATIVE: Single Shared Database with Physical Foreign Keys
-- =============================================================================
-- If you choose to deploy all tables inside a single database (e.g. food_order_db),
-- you can run the following script to add physical foreign key relationships:
--
-- CREATE DATABASE IF NOT EXISTS food_order_db;
-- USE food_order_db;
--
-- [Create orders, payments, kitchen_tickets, and deliveries in the same DB]
--
-- ALTER TABLE payments 
-- ADD CONSTRAINT fk_payments_orders 
-- FOREIGN KEY (order_id) REFERENCES orders(id) 
-- ON DELETE CASCADE;
--
-- ALTER TABLE kitchen_tickets 
-- ADD CONSTRAINT fk_kitchen_tickets_orders 
-- FOREIGN KEY (order_id) REFERENCES orders(id) 
-- ON DELETE CASCADE;
--
-- ALTER TABLE deliveries 
-- ADD CONSTRAINT fk_deliveries_orders 
-- FOREIGN KEY (order_id) REFERENCES orders(id) 
-- ON DELETE CASCADE;
-- =============================================================================
