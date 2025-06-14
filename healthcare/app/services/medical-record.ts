import { ApiService } from './api';

export interface MedicalRecord {
    id: number;
    userId: number;
    type: string;
    provider: string;
    department: string;
    summary: string;
    attachments: number;
    date: string;
    createdAt: string;
    updatedAt: string;
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

class MedicalRecordService extends ApiService {
    async getMedicalRecords(): Promise<MedicalRecord[]> {
        return this.get<MedicalRecord[]>('/api/medical-records');
    }

    async getMedicalRecord(id: number): Promise<MedicalRecord> {
        return this.get<MedicalRecord>(`/api/medical-records/${id}`);
    }

    async createMedicalRecord(input: CreateMedicalRecordInput): Promise<MedicalRecord> {
        return this.post<MedicalRecord>('/api/medical-records', input);
    }

    async updateMedicalRecord(id: number, input: UpdateMedicalRecordInput): Promise<MedicalRecord> {
        return this.put<MedicalRecord>(`/api/medical-records/${id}`, input);
    }

    async deleteMedicalRecord(id: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/medical-records/${id}`);
    }

    async getUserMedicalRecords(userId: number): Promise<MedicalRecord[]> {
        return this.get<MedicalRecord[]>(`/api/medical-records/user/${userId}`);
    }

    async uploadAttachment(recordId: number, file: File): Promise<{ message: string; url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/api/medical-records/${recordId}/attachments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload attachment');
        }

        return response.json();
    }
}

export const medicalRecordService = new MedicalRecordService(); 