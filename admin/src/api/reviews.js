import { apiClient } from "./client";

export function getReviews(params = {}) {
  return apiClient("/reviews", { query: params });
}

export function toggleReviewStatus(id) {
  return apiClient(`/reviews/${id}/toggle`, {
    method: "PATCH",
  });
}
