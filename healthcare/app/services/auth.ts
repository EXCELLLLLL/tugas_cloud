import { ApiService } from './api';
import { API_URL } from '../config';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    address?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    phone?: string;
    address?: string;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
}

export interface BioInformation {
    fullName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    email: string;
    bloodType: string;
    allergies: string;
    medications: string;
    chronic: string;
    insuranceProvider: string;
    policyNumber: string;
    emergencyContacts: { name: string; phone: string }[];
    profilePhoto?: string | null;
    insuranceCard?: string | null;
}

export interface Activity {
    id: number;
    userId: number;
    type: string;
    details: string;
    createdAt: string;
}

export interface MedicalRecord {
    id: number;
    type: string;
    provider: string;
    department: string;
    summary: string;
    attachments: number;
    date: string;
    createdAt: string;
    updatedAt: string;
    status: 'final' | 'preliminary' | 'draft';
    category: 'lab' | 'imaging' | 'consultation' | 'prescription';
}

export interface CreateMedicalRecordInput {
    type: string;
    provider: string;
    department: string;
    summary: string;
    attachments?: number;
    date: string;
}

export interface UpdateMedicalRecordInput {
    type?: string;
    provider?: string;
    department?: string;
    summary?: string;
    attachments?: number;
    date?: string;
}

class AuthService extends ApiService {
    async login(input: LoginInput): Promise<AuthResponse> {
        console.log('Attempting login with:', { email: input.email });
        console.log('API URL:', API_URL);
        const response = await this.post<AuthResponse>('/api/users/login', input);
        console.log('Login response:', response);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async register(input: RegisterInput): Promise<AuthResponse> {
        console.log('Attempting registration with:', { email: input.email, firstName: input.firstName, lastName: input.lastName });
        console.log('API URL:', API_URL);
        console.log('Full URL:', `${API_URL}/api/users/register`);
        const response = await this.post<AuthResponse>('/api/users/register', input);
        console.log('Register response:', response);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async verifyToken(): Promise<User> {
        // Use the profile endpoint to verify the token and get the user
        return this.get<User>('/api/users/profile');
    }

    async getProfile(): Promise<User> {
        return this.get<User>('/api/users/profile');
    }

    async updateProfile(input: UpdateProfileInput): Promise<User> {
        return this.put<User>('/api/users/profile', input);
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
        return this.put<{ message: string }>('/api/users/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
    }

    async logout(): Promise<void> {
        this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    async getActivities(): Promise<Activity[]> {
        try {
            const response = await fetch(`${API_URL}/api/users/activities`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch activities');
            }

            const data = await response.json();
            return data.activities;
        } catch (error) {
            console.warn('API fetch activities failed, returning mock data:', error);
            // Return mock activities data when API is not available
            const now = new Date().toISOString();
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

            return [
                {
                    id: 1,
                    userId: 1,
                    type: 'login',
                    details: 'User logged in',
                    createdAt: now
                },
                {
                    id: 2,
                    userId: 1,
                    type: 'profile_update',
                    details: 'Profile updated',
                    createdAt: fiveMinutesAgo
                },
                {
                    id: 3,
                    userId: 1,
                    type: 'login',
                    details: 'User logged in',
                    createdAt: tenMinutesAgo
                }
            ];
        }
    }

    // Medical Records Methods
    async getMedicalRecords(): Promise<MedicalRecord[]> {
        try {
            const response = await fetch(`${API_URL}/records`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch medical records');
            }

            return response.json();
        } catch (error) {
            console.warn('API fetch failed, returning mock data:', error);
            // Return mock data when API is not available
            return [
                {
                    id: 1,
                    type: 'Complete Blood Count',
                    provider: 'Dr. Sarah Johnson',
                    department: 'Laboratory',
                    summary: 'Complete blood count and lipid panel results',
                    attachments: 2,
                    date: '2024-03-15',
                    createdAt: '2024-03-15T10:30:00Z',
                    updatedAt: '2024-03-15T10:30:00Z',
                    status: 'final',
                    category: 'lab'
                },
                {
                    id: 2,
                    type: 'Chest X-ray',
                    provider: 'Dr. Michael Chen',
                    department: 'Radiology',
                    summary: 'Chest X-ray examination results',
                    attachments: 1,
                    date: '2024-03-10',
                    createdAt: '2024-03-10T14:15:00Z',
                    updatedAt: '2024-03-10T14:15:00Z',
                    status: 'final',
                    category: 'imaging'
                },
                {
                    id: 3,
                    type: 'Follow-up Consultation',
                    provider: 'Dr. Emily Brown',
                    department: 'Orthopedics',
                    summary: 'Follow-up consultation for knee pain',
                    attachments: 0,
                    date: '2024-03-05',
                    createdAt: '2024-03-05T09:45:00Z',
                    updatedAt: '2024-03-05T09:45:00Z',
                    status: 'final',
                    category: 'consultation'
                },
                {
                    id: 4,
                    type: 'Prescription Renewal',
                    provider: 'Dr. James Wilson',
                    department: 'Cardiology',
                    summary: 'Prescription renewal for blood pressure medication',
                    attachments: 1,
                    date: '2024-03-01',
                    createdAt: '2024-03-01T11:20:00Z',
                    updatedAt: '2024-03-01T11:20:00Z',
                    status: 'final',
                    category: 'prescription'
                }
            ];
        }
    }

    async getMedicalRecord(id: number): Promise<MedicalRecord> {
        try {
            const response = await fetch(`${API_URL}/records/${id}`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch medical record');
            }

            return response.json();
        } catch (error) {
            console.warn('API fetch failed, returning mock data:', error);
            // Return mock data when API is not available
            const mockRecords = {
                1: {
                    id: 1,
                    type: 'Complete Blood Count',
                    provider: 'Dr. Sarah Johnson',
                    department: 'Laboratory',
                    summary: 'Complete blood count and lipid panel results',
                    attachments: 2,
                    date: '2024-03-15',
                    createdAt: '2024-03-15T10:30:00Z',
                    updatedAt: '2024-03-15T10:30:00Z',
                    status: 'final',
                    category: 'lab'
                },
                2: {
                    id: 2,
                    type: 'Chest X-ray',
                    provider: 'Dr. Michael Chen',
                    department: 'Radiology',
                    summary: 'Chest X-ray examination results',
                    attachments: 1,
                    date: '2024-03-10',
                    createdAt: '2024-03-10T14:15:00Z',
                    updatedAt: '2024-03-10T14:15:00Z',
                    status: 'final',
                    category: 'imaging'
                },
                3: {
                    id: 3,
                    type: 'Follow-up Consultation',
                    provider: 'Dr. Emily Brown',
                    department: 'Orthopedics',
                    summary: 'Follow-up consultation for knee pain',
                    attachments: 0,
                    date: '2024-03-05',
                    createdAt: '2024-03-05T09:45:00Z',
                    updatedAt: '2024-03-05T09:45:00Z',
                    status: 'final',
                    category: 'consultation'
                },
                4: {
                    id: 4,
                    type: 'Prescription Renewal',
                    provider: 'Dr. James Wilson',
                    department: 'Cardiology',
                    summary: 'Prescription renewal for blood pressure medication',
                    attachments: 1,
                    date: '2024-03-01',
                    createdAt: '2024-03-01T11:20:00Z',
                    updatedAt: '2024-03-01T11:20:00Z',
                    status: 'final',
                    category: 'prescription'
                }
            };

            return mockRecords[id as keyof typeof mockRecords] || {
                id: id,
                type: 'Check-up',
                provider: 'Dr. Smith',
                department: 'General Medicine',
                summary: 'Regular check-up, all vitals normal',
                attachments: 2,
                date: '2024-03-15',
                createdAt: '2024-03-15T10:00:00Z',
                updatedAt: '2024-03-15T10:00:00Z',
                status: 'final',
                category: 'consultation'
            };
        }
    }

    async createMedicalRecord(input: CreateMedicalRecordInput): Promise<MedicalRecord> {
        try {
            const response = await fetch(`${API_URL}/records`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error('Failed to create medical record');
            }

            return response.json();
        } catch (error) {
            console.warn('API fetch failed, returning mock data:', error);
            // Return mock data when API is not available
            return {
                id: Math.floor(Math.random() * 1000),
                ...input,
                attachments: input.attachments || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'final',
                category: 'consultation'
            };
        }
    }

    async updateMedicalRecord(id: number, input: UpdateMedicalRecordInput): Promise<MedicalRecord> {
        try {
            const response = await fetch(`${API_URL}/records/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error('Failed to update medical record');
            }

            return response.json();
        } catch (error) {
            console.warn('API fetch failed, returning mock data:', error);
            // Return mock data when API is not available
            return {
                id: id,
                type: input.type || 'Check-up',
                provider: input.provider || 'Dr. Smith',
                department: input.department || 'General Medicine',
                summary: input.summary || 'Regular check-up',
                attachments: input.attachments || 0,
                date: input.date || '2024-03-15',
                createdAt: '2024-03-15T10:00:00Z',
                updatedAt: new Date().toISOString(),
                status: 'final',
                category: 'consultation'
            };
        }
    }

    async deleteMedicalRecord(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/records/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete medical record');
            }
        } catch (error) {
            console.warn('API fetch failed:', error);
            throw error;
        }
    }

    async updateBioInformation(bioInfo: BioInformation): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/api/users/bio`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(bioInfo)
            });

            if (!response.ok) {
                throw new Error('Failed to update bio information');
            }
        } catch (error) {
            console.warn('API fetch failed:', error);
            throw error;
        }
    }
}

export const authService = new AuthService();
