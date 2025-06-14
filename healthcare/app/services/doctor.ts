import { ApiService } from './api';

export interface Doctor {
    id: number;
    userId: number;
    specialization: string;
    licenseNumber: string;
    education: Education[];
    availability: Availability[];
    createdAt: string;
    updatedAt: string;
}

export interface Education {
    id: number;
    doctorId: number;
    degree: string;
    institution: string;
    year: number;
    specialization?: string;
}

export interface Availability {
    id: number;
    doctorId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface CreateDoctorInput {
    userId: number;
    specialization: string;
    licenseNumber: string;
    education: Omit<Education, 'id' | 'doctorId'>[];
    availability: Omit<Availability, 'id' | 'doctorId'>[];
}

export interface UpdateDoctorInput {
    specialization?: string;
    licenseNumber?: string;
}

export interface CreateEducationInput {
    degree: string;
    institution: string;
    year: number;
    specialization?: string;
}

export interface UpdateEducationInput {
    degree?: string;
    institution?: string;
    year?: number;
    specialization?: string;
}

export interface CreateAvailabilityInput {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface UpdateAvailabilityInput {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
}

class DoctorService extends ApiService {
    async getDoctors(): Promise<Doctor[]> {
        return this.get<Doctor[]>('/api/doctors');
    }

    async getDoctor(id: number): Promise<Doctor> {
        return this.get<Doctor>(`/api/doctors/${id}`);
    }

    async createDoctor(input: CreateDoctorInput): Promise<Doctor> {
        return this.post<Doctor>('/api/doctors', input);
    }

    async updateDoctor(id: number, input: UpdateDoctorInput): Promise<Doctor> {
        return this.put<Doctor>(`/api/doctors/${id}`, input);
    }

    async deleteDoctor(id: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/doctors/${id}`);
    }

    async getDoctorByUserId(userId: number): Promise<Doctor> {
        return this.get<Doctor>(`/api/doctors/user/${userId}`);
    }

    async getDoctorEducation(doctorId: number): Promise<Education[]> {
        return this.get<Education[]>(`/api/doctors/${doctorId}/education`);
    }

    async addEducation(doctorId: number, input: CreateEducationInput): Promise<Education> {
        return this.post<Education>(`/api/doctors/${doctorId}/education`, input);
    }

    async updateEducation(doctorId: number, educationId: number, input: UpdateEducationInput): Promise<Education> {
        return this.put<Education>(`/api/doctors/${doctorId}/education/${educationId}`, input);
    }

    async deleteEducation(doctorId: number, educationId: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/doctors/${doctorId}/education/${educationId}`);
    }

    async getDoctorAvailability(doctorId: number): Promise<Availability[]> {
        return this.get<Availability[]>(`/api/doctors/${doctorId}/availability`);
    }

    async addAvailability(doctorId: number, input: CreateAvailabilityInput): Promise<Availability> {
        return this.post<Availability>(`/api/doctors/${doctorId}/availability`, input);
    }

    async updateAvailability(doctorId: number, availabilityId: number, input: UpdateAvailabilityInput): Promise<Availability> {
        return this.put<Availability>(`/api/doctors/${doctorId}/availability/${availabilityId}`, input);
    }

    async deleteAvailability(doctorId: number, availabilityId: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/doctors/${doctorId}/availability/${availabilityId}`);
    }

    async getAvailableDoctors(date: string): Promise<Doctor[]> {
        return this.get<Doctor[]>(`/api/doctors/available?date=${date}`);
    }
}

export const doctorService = new DoctorService(); 