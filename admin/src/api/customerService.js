import { apiClient } from "./client";

export function getCustomerServiceInquiries(params = {}) {
  return apiClient("/customer-service", { query: params });
}

export function replyCustomerServiceInquiry(id, body) {
  return apiClient(`/customer-service/${id}/reply`, {
    method: "PATCH",
    body,
  });
}
