import { ApiService } from './api';

export interface Bill {
    id: number;
    userId: number;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    dueDate: string;
    items: BillItem[];
    createdAt: string;
    updatedAt: string;
}

export interface BillItem {
    id: number;
    billId: number;
    description: string;
    amount: number;
    quantity: number;
    unitPrice: number;
}

export interface CreateBillInput {
    userId: number;
    amount: number;
    dueDate: string;
    items: Omit<BillItem, 'id' | 'billId'>[];
}

export interface UpdateBillInput {
    amount?: number;
    status?: 'pending' | 'paid' | 'overdue';
    dueDate?: string;
}

class BillingService extends ApiService {
    async getBills(): Promise<Bill[]> {
        return this.get<Bill[]>('/api/bills');
    }

    async getBill(id: number): Promise<Bill> {
        return this.get<Bill>(`/api/bills/${id}`);
    }

    async createBill(input: CreateBillInput): Promise<Bill> {
        return this.post<Bill>('/api/bills', input);
    }

    async updateBill(id: number, input: UpdateBillInput): Promise<Bill> {
        return this.put<Bill>(`/api/bills/${id}`, input);
    }

    async deleteBill(id: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/bills/${id}`);
    }

    async getUserBills(userId: number): Promise<Bill[]> {
        return this.get<Bill[]>(`/api/bills/user/${userId}`);
    }

    async payBill(id: number, amount: number): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/api/bills/${id}/pay`, { amount });
    }

    async getBillItems(billId: number): Promise<BillItem[]> {
        return this.get<BillItem[]>(`/api/bills/${billId}/items`);
    }

    async addBillItem(billId: number, item: Omit<BillItem, 'id' | 'billId'>): Promise<BillItem> {
        return this.post<BillItem>(`/api/bills/${billId}/items`, item);
    }

    async updateBillItem(billId: number, itemId: number, item: Partial<Omit<BillItem, 'id' | 'billId'>>): Promise<BillItem> {
        return this.put<BillItem>(`/api/bills/${billId}/items/${itemId}`, item);
    }

    async deleteBillItem(billId: number, itemId: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/bills/${billId}/items/${itemId}`);
    }
}

export const billingService = new BillingService(); 