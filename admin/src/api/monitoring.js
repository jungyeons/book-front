import { apiClient } from "./client";

export function getAccessLogs(params = {}) {
  return apiClient("/monitoring/access-logs", { query: params });
}
