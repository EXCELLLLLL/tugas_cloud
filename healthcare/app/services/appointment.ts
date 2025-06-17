import { ApiService } from './api';

export interface Appointment {
    id: number;
    userId: number;
    doctorId: number;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    type: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentInput {
    doctorId: number;
    date: string;
    time: string;
    type: string;
    notes?: string;
}

export interface UpdateAppointmentInput {
    date?: string;
    time?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    type?: string;
    notes?: string;
}

class AppointmentService extends ApiService {
    async getAppointments(): Promise<Appointment[]> {
        return this.get<Appointment[]>('/api/appointments');
    }

    async getAppointment(id: number): Promise<Appointment> {
        return this.get<Appointment>(`/api/appointments/${id}`);
    }

    async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
        return this.post<Appointment>('/api/appointments', input);
    }

    async updateAppointment(id: number, input: UpdateAppointmentInput): Promise<Appointment> {
        return this.put<Appointment>(`/api/appointments/${id}`, input);
    }

    async cancelAppointment(id: number): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/api/appointments/${id}/cancel`, {});
    }

    async rescheduleAppointment(id: number, date: string, time: string): Promise<Appointment> {
        return this.put<Appointment>(`/api/appointments/${id}/reschedule`, { date, time });
    }

    async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
        return this.get<Appointment[]>(`/api/appointments/doctor/${doctorId}`);
    }

    async getUserAppointments(userId: number): Promise<Appointment[]> {
        return this.get<Appointment[]>(`/api/appointments/user/${userId}`);
    }
}

export const appointmentService = new AppointmentService(); 