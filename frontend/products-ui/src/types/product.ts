export interface Product {
  id: string;
  name: string;
  colour: string;
  price: number;
  createdAtUtc: string;
}

export interface CreateProductRequest {
  name: string;
  colour: string;
  price: number;
}

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
}

export interface HealthResponse {
  status: string;
  timestampUtc: string;
}
