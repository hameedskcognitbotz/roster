const API_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('token');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (this.token) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    // Auth
    async login(email: string, password: string) {
        const result = await this.request<{ token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        this.setToken(result.token);
        return result;
    }

    async register(data: { name: string; email: string; password: string }) {
        const result = await this.request<{ token: string; user: any }>('/auth/register', {
            method: 'POST',
            body: data,
        });
        this.setToken(result.token);
        return result;
    }

    async getCurrentUser() {
        return this.request<any>('/auth/me');
    }

    logout() {
        this.setToken(null);
    }

    // Users
    async getUsers(params?: { teamId?: string; role?: string }) {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
        return this.request<any[]>(`/users${query}`);
    }

    async getUser(id: string) {
        return this.request<any>(`/users/${id}`);
    }

    async updateUser(id: string, data: any) {
        return this.request<any>(`/users/${id}`, { method: 'PUT', body: data });
    }

    // Teams
    async getTeams() {
        return this.request<any[]>('/teams');
    }

    async getTeam(id: string) {
        return this.request<any>(`/teams/${id}`);
    }

    async createTeam(data: { name: string; color: string; description?: string }) {
        return this.request<any>('/teams', { method: 'POST', body: data });
    }

    // Shifts
    async getShifts(params?: { userId?: string; startDate?: string; endDate?: string }) {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
        return this.request<any[]>(`/shifts${query}`);
    }

    async createShift(data: { userId: string; startTime: string; endTime: string; notes?: string }) {
        return this.request<any>('/shifts', { method: 'POST', body: data });
    }

    async updateShift(id: string, data: any) {
        return this.request<any>(`/shifts/${id}`, { method: 'PUT', body: data });
    }

    async deleteShift(id: string) {
        return this.request<any>(`/shifts/${id}`, { method: 'DELETE' });
    }

    // Time-off
    async getTimeOffRequests(params?: { userId?: string; status?: string }) {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
        return this.request<any[]>(`/timeoff${query}`);
    }

    async createTimeOffRequest(data: { startDate: string; endDate: string; type: string; reason?: string }) {
        return this.request<any>('/timeoff', { method: 'POST', body: data });
    }

    async updateTimeOffStatus(id: string, status: 'approved' | 'rejected', reviewedBy: string) {
        return this.request<any>(`/timeoff/${id}/status`, {
            method: 'PATCH',
            body: { status, reviewedBy }
        });
    }

    // Notifications
    async getNotifications(userId: string, unreadOnly = false) {
        const params = new URLSearchParams({ userId });
        if (unreadOnly) params.set('unreadOnly', 'true');
        return this.request<any[]>(`/notifications?${params}`);
    }

    async markNotificationRead(id: string) {
        return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
    }

    async markAllNotificationsRead(userId: string) {
        return this.request<any>('/notifications/read-all', {
            method: 'PATCH',
            body: { userId }
        });
    }

    async getUnreadCount(userId: string) {
        return this.request<{ count: number }>(`/notifications/unread-count?userId=${userId}`);
    }

    // Dashboard
    async getDashboardStats() {
        return this.request<any>('/dashboard/stats');
    }
}

export const api = new ApiClient(API_URL);
