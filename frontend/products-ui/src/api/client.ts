import type { CreateProductRequest, HealthResponse, LoginResponse, Product } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7243';

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
      throw new Error(errorBody || `Request failed with status ${response.status}`);
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
