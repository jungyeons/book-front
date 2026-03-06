import { apiClient } from "./client";

export function getCoupons(params = {}) {
  return apiClient("/coupons", { query: params });
}

export function createCoupon(data) {
  return apiClient("/coupons", {
    method: "POST",
    body: data,
  });
}

export function updateCoupon(id, data) {
  return apiClient(`/coupons/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteCoupon(id) {
  return apiClient(`/coupons/${id}`, {
    method: "DELETE",
  });
}
