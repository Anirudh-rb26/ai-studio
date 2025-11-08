/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Generation {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  status: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  retryable?: boolean;
  details?: any[];
}

export interface AuthResponse {
  token: string;
}

export interface AuthError {
  message: string;
}

// Existing auth API
export const authApi = {
  signup: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },
};

// NEW: Generations API
class GenerationsApi {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("authToken");
    }
    return null;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error;
    }
    return response.json();
  }

  async createGeneration(
    image: File,
    prompt: string,
    style: string,
    signal?: AbortSignal
  ): Promise<Generation> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);
    formData.append("style", style);

    const token = this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal,
    });

    return this.handleResponse<Generation>(response);
  }

  async getGenerations(limit: number = 5): Promise<{ generations: Generation[]; total: number }> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/generations?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }
}

export const generationsApi = new GenerationsApi();
