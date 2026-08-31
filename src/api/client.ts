import axios from 'axios';

export const BASE_URL = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `Request failed (${error.response.status}): ${
        error.response.statusText || 'Server error'
      }`;
    }
    if (error.request) {
      return 'No response from server. Please check your connection and try again.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}

export function getHttpStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}

export function isNotFoundError(error: unknown): boolean {
  return getHttpStatus(error) === 404;
}
