import { request } from './apiClient.js';

export function getHealthStatus() {
  return request('/health');
}
