import { API_URL } from '../config';

export interface ApiError {
    error: string;
    message: string;
}

export class ApiService {
    protected baseUrl: string;
    protected token: string | null;

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
        this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        console.log('API Service initialized with base URL:', this.baseUrl);
    }

    protected getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                console.error('API error:', error);
                throw new Error(error.message || error.error || 'Request failed');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Response data:', data);
            return data;
        }

        // Handle non-JSON responses
        const text = await response.text();
        if (!text) {
            return {} as T;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Invalid JSON response from server');
        }
    }

    protected async get<T>(endpoint: string): Promise<T> {
        console.log('GET request to:', `${this.baseUrl}${endpoint}`);
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    protected async post<T>(endpoint: string, data: any): Promise<T> {
        console.log('POST request to:', `${this.baseUrl}${endpoint}`);
        console.log('Request data:', data);
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    protected async put<T>(endpoint: string, data: any): Promise<T> {
        console.log('PUT request to:', `${this.baseUrl}${endpoint}`);
        console.log('Request data:', data);
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    protected async delete<T>(endpoint: string): Promise<T> {
        console.log('DELETE request to:', `${this.baseUrl}${endpoint}`);
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }
} 