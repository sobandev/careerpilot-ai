import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://careerpilot-api.onrender.com';

class APIService {
    private token: string | null = null;
    private refreshPromise: Promise<boolean> | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('cp_token');
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) localStorage.setItem('cp_token', token);
            else localStorage.removeItem('cp_token');
        }
    }

    private async handleTokenRefresh(): Promise<boolean> {
        if (this.refreshPromise) return this.refreshPromise;

        this.refreshPromise = (async () => {
            try {
                // The backend needs to read the httpOnly refresh_token cookie
                // We'll hit a new endpoint or rely on supabase implicitly using cookies if set up, 
                // but since we set them via fastapi, hitting an innocuous endpoint that triggers 
                // the refresh flow if necessary, OR just letting the browser send the cookie.
                // For this migration, we'll try hitting a refresh endpoint if established, 
                // but since FastApi manages it, we just need to let the next request send the cookies.
                // Note: The /api/auth/me endpoint doesn't refresh tokens in our python code currently,
                // so we rely on the backend to handle 401s or the client to login again.
                // In a true httpOnly setup, the refresh logic should also be moved to backend middleware.
                // For now, if a 401 happens and cookies don't work, we force re-login.

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('cp_user');
                }
                return false;
            } catch (error) {
                throw error;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    public async request<T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        // With HttpOnly cookies, we remove explicit Authorization header 
        // and include credentials so the browser passes the cookies.
        let response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        if (response.status === 401) {
            try {
                const refreshed = await this.handleTokenRefresh();
                if (refreshed) {
                    response = await fetch(`${API_URL}${path}`, {
                        ...options,
                        headers,
                        credentials: 'include',
                    });
                }
            } catch (err) {
                throw new Error('Session expired');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }
        return response.json() as T;
    }

    // Auth
    async login(email: string, password: string) {
        return this.request<{ access_token: string; refresh_token: string; user: Record<string, unknown> }>(
            '/api/auth/login',
            { method: 'POST', body: JSON.stringify({ email, password }) }
        );
    }

    async register(email: string, password: string, full_name: string, role: string) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name, role }),
        });
    }

    async getMe() {
        return this.request('/api/auth/me');
    }

    // Resume
    async uploadResume(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const headers: Record<string, string> = {};
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

        let response = await fetch(`${API_URL}/api/resume/upload`, {
            method: 'POST',
            headers,
            body: formData,
            credentials: 'include',
        });

        if (response.status === 401) {
            try {
                const refreshed = await this.handleTokenRefresh();
                if (refreshed) {
                    response = await fetch(`${API_URL}/api/resume/upload`, {
                        method: 'POST',
                        headers,
                        body: formData,
                        credentials: 'include',
                    });
                }
            } catch (err) {
                throw new Error('Session expired');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
            throw new Error(error.detail || 'Upload failed');
        }
        return response.json();
    }

    async getResumeAnalysis() {
        return this.request('/api/resume/analysis');
    }

    // Jobs
    async getJobs(params?: { q?: string; industry?: string; location?: string; job_type?: string; limit?: number; offset?: number }) {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.request<{ jobs: Record<string, unknown>[]; total: number }>(`/api/jobs${query ? `?${query}` : ''}`);
    }

    async getJob(id: string) {
        return this.request(`/api/jobs/${id}`);
    }

    async getJobScore(jobId: string) {
        return this.request(`/api/jobs/${jobId}/score`);
    }

    async createJob(data: Record<string, unknown>) {
        return this.request('/api/jobs', { method: 'POST', body: JSON.stringify(data) });
    }

    async postJob(data: Record<string, unknown>) {
        return this.createJob(data);
    }

    async getFeed() {
        return this.request<{ highly_relevant: Record<string, unknown>[]; based_on_skills: Record<string, unknown>[]; trending: Record<string, unknown>[] }>('/api/jobs/feed');
    }

    // Applications
    async applyToJob(jobId: string, coverLetter?: string, contactEmail?: string, contactPhone?: string) {
        return this.request('/api/applications', {
            method: 'POST',
            body: JSON.stringify({
                job_id: jobId,
                cover_letter: coverLetter,
                contact_email: contactEmail,
                contact_phone: contactPhone
            }),
        });
    }

    async getApplications() {
        return this.request<{ applications: Record<string, unknown>[] }>('/api/applications');
    }

    async getEmployerApplications(jobId?: string) {
        const q = jobId ? `?job_id=${jobId}` : '';
        return this.request(`/api/applications/employer${q}`);
    }

    async getApplicants(jobId?: string) {
        const result = await this.getEmployerApplications(jobId);
        return { applicants: (result as Record<string, unknown[]>).applications || [] };
    }

    async updateApplicationStatus(applicationId: string, status: string) {
        return this.request(`/api/applications/${applicationId}/status?status=${status}`, {
            method: 'PATCH',
        });
    }

    // AI
    async generateRoadmap(targetRole?: string) {
        return this.request('/api/ai/roadmap', {
            method: 'POST',
            body: JSON.stringify({ target_role: targetRole }),
        });
    }

    async getRoadmap() {
        return this.request('/api/ai/roadmap');
    }

    // Public Profiles
    async getPublicProfile(userId: string) {
        return this.request<{
            profile: Record<string, unknown>,
            resume: Record<string, unknown> | null,
            analysis: Record<string, unknown> | null
        }>(`/api/profiles/${userId}`);
    }

    async updateProfile(data: { full_name?: string; avatar_url?: string; phone?: string; location?: string }) {
        return this.request('/api/profiles/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async createCompany(data: Record<string, unknown>) {
        return this.request('/api/ai/company', { method: 'POST', body: JSON.stringify(data) });
    }

    async getMyCompany() {
        return this.request('/api/ai/company/me');
    }

    async getEmployerStats() {
        return this.request('/api/ai/employer/stats');
    }
}

export const api = new APIService();
export default api;
