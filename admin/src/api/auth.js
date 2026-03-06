import { apiClient } from "./client";

export function loginApi(username, password) {
  return apiClient("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function changePasswordApi(currentPassword, newPassword) {
  return apiClient("/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}
