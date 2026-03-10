import { apiClient } from "./client";

export function createNotice(data) {
  return apiClient("/notices", {
    method: "POST",
    body: data,
  });
}
