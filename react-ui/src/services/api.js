const ORDER_API = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8081/api/orders';
const KITCHEN_API = import.meta.env.VITE_KITCHEN_API_URL || 'http://localhost:8083/api/kitchen/orders';
const DELIVERY_API = import.meta.env.VITE_DELIVERY_API_URL || 'http://localhost:8084/api/deliveries';

export async function createOrder(customerName, items, totalAmount) {
  const response = await fetch(ORDER_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, items, totalAmount })
  });
  return response.json();
}

export async function getOrders() {
  const response = await fetch(ORDER_API);
  return response.json();
}

export async function getOrderById(id) {
  const response = await fetch(`${ORDER_API}/${id}`);
  return response.json();
}

export async function getKitchenOrders() {
  const response = await fetch(KITCHEN_API);
  return response.json();
}

export async function prepareKitchenOrder(id) {
  const response = await fetch(`${KITCHEN_API}/${id}/prepare`, {
    method: 'PUT'
  });
  return response.json();
}

export async function readyKitchenOrder(id) {
  const response = await fetch(`${KITCHEN_API}/${id}/ready`, {
    method: 'PUT'
  });
  return response.json();
}

export async function getDeliveries() {
  const response = await fetch(DELIVERY_API);
  return response.json();
}

export async function startDelivery(id) {
  const response = await fetch(`${DELIVERY_API}/${id}/start`, {
    method: 'PUT'
  });
  return response.json();
}

export async function completeDelivery(id) {
  const response = await fetch(`${DELIVERY_API}/${id}/complete`, {
    method: 'PUT'
  });
  return response.json();
}
