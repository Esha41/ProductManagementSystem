import type { CreateProductRequest, HealthResponse, LoginResponse, Product } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7243';

function parseApiError(errorBody: string, status: number): string {
  if (!errorBody.trim()) {
    return getDefaultErrorMessage(status);
  }

  try {
    const parsed = JSON.parse(errorBody) as {
      detail?: string;
      title?: string;
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (parsed.detail) {
      return parsed.detail;
    }

    if (parsed.message) {
      return parsed.message;
    }

    if (parsed.errors) {
      const messages = Object.values(parsed.errors).flat();
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    if (parsed.title && parsed.title !== 'Unauthorized' && parsed.title !== 'BadRequest') {
      return parsed.title;
    }
  } catch {
    // Not JSON — use raw text if it looks like a plain message
    if (!errorBody.startsWith('{')) {
      return errorBody;
    }
  }

  return getDefaultErrorMessage(status);
}

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Invalid username or password.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 400:
      return 'The request was invalid. Please check your input.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(parseApiError(errorBody, response.status));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  getHealth() {
    return this.request<HealthResponse>('/api/health');
  }

  login(username: string, password: string) {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  getProducts(colour?: string) {
    const query = colour ? `?colour=${encodeURIComponent(colour)}` : '';
    return this.request<Product[]>(`/api/products${query}`);
  }

  createProduct(payload: CreateProductRequest) {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient();
