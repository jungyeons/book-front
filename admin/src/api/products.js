import { apiClient } from "./client";

export function getProducts(params = {}) {
  return apiClient("/products", { query: params });
}

export function getProduct(id) {
  return apiClient(`/products/${id}`);
}

export function createProduct(data) {
  return apiClient("/products", {
    method: "POST",
    body: data,
  });
}

export function updateProduct(id, data) {
  return apiClient(`/products/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteProducts(ids) {
  return apiClient("/products", {
    method: "DELETE",
    body: { ids },
  });
}
