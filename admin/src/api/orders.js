import { apiClient } from "./client";

export function getOrders(params = {}) {
  return apiClient("/orders", { query: params });
}

export function getOrder(id) {
  return apiClient(`/orders/${id}`);
}

export function updateOrderStatus(id, data) {
  return apiClient(`/orders/${id}/status`, {
    method: "PATCH",
    body: data,
  });
}
