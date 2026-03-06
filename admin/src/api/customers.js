import { apiClient } from "./client";

export function getCustomers(params = {}) {
  return apiClient("/customers", { query: params });
}

export function getCustomer(id) {
  return apiClient(`/customers/${id}`);
}

export function getCustomerOrders(customerId) {
  return apiClient(`/customers/${customerId}/orders`);
}

export function updateCustomerMemberAccess(id, body) {
  return apiClient(`/customers/${id}/member-access`, {
    method: "PATCH",
    body,
  });
}
