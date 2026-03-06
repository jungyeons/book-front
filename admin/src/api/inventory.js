import { apiClient } from "./client";

export function getInventoryLogs(params = {}) {
  return apiClient("/inventory/logs", { query: params });
}

export function getInventoryProducts(params = {}) {
  return apiClient("/inventory/products", { query: params });
}

export function adjustInventory(data) {
  return apiClient("/inventory/adjust", {
    method: "POST",
    body: data,
  });
}
