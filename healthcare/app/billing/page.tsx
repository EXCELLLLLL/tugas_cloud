"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';

interface Bill {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    category: 'consultation' | 'procedure' | 'medication' | 'lab' | 'other';
}

interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card' | 'bank_account';
    last4: string;
    expiryDate?: string;
    isDefault: boolean;
}

interface InsuranceClaim {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'approved' | 'pending' | 'rejected';
    claimNumber: string;
}

export default function BillingPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [bills, setBills] = useState<Bill[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [claims, setClaims] = useState<InsuranceClaim[]>([]);
    const [selectedTab, setSelectedTab] = useState<'bills' | 'payments' | 'claims'>('bills');
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [showPayBillModal, setShowPayBillModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Simulated data - replace with actual API calls
        setBills([
            {
                id: '1',
                date: '2024-03-15',
                description: 'Annual Physical Examination',
                amount: 250.00,
                status: 'pending',
                dueDate: '2024-04-15',
                category: 'consultation'
            },
            {
                id: '2',
                date: '2024-03-10',
                description: 'Blood Work',
                amount: 150.00,
                status: 'paid',
                dueDate: '2024-03-25',
                category: 'lab'
            },
            {
                id: '3',
                date: '2024-03-05',
                description: 'Prescription Medication',
                amount: 75.00,
                status: 'overdue',
                dueDate: '2024-03-20',
                category: 'medication'
            }
        ]);

        setPaymentMethods([
            {
                id: '1',
                type: 'credit_card',
                last4: '4242',
                expiryDate: '12/25',
                isDefault: true
            },
            {
                id: '2',
                type: 'bank_account',
                last4: '5678',
                isDefault: false
            }
        ]);

        setClaims([
            {
                id: '1',
                date: '2024-03-15',
                description: 'Annual Physical Examination',
                amount: 200.00,
                status: 'approved',
                claimNumber: 'CLM-2024-001'
            },
            {
                id: '2',
                date: '2024-03-10',
                description: 'Blood Work',
                amount: 120.00,
                status: 'pending',
                claimNumber: 'CLM-2024-002'
            }
        ]);
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'consultation':
                return '👨‍⚕️';
            case 'procedure':
                return '🔬';
            case 'medication':
                return '💊';
            case 'lab':
                return '🧪';
            default:
                return '📋';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-[#f5f6f7] font-sans">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#0a3fa8] mb-2">Billing & Insurance</h1>
                            <p className="text-gray-600">Manage your bills, payments, and insurance claims</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={() => setShowAddPaymentModal(true)}
                                className="px-4 py-2 bg-[#0a3fa8] text-white rounded-lg hover:bg-[#083080] transition-colors"
                            >
                                Add Payment Method
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['bills', 'payments', 'claims'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab as 'bills' | 'payments' | 'claims')}
                                    className={`${selectedTab === tab
                                            ? 'border-[#0a3fa8] text-[#0a3fa8]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Bills Tab */}
                    {selectedTab === 'bills' && (
                        <div className="mt-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bills.map((bill) => (
                                            <tr key={bill.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(bill.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className="mr-2">{getCategoryIcon(bill.category)}</span>
                                                        <span className="text-sm text-gray-900">{bill.description}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(bill.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(bill.dueDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                                                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {bill.status === 'pending' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBill(bill);
                                                                setShowPayBillModal(true);
                                                            }}
                                                            className="text-[#0a3fa8] hover:text-[#083080]"
                                                        >
                                                            Pay Now
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payments Tab */}
                    {selectedTab === 'payments' && (
                        <div className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="bg-gray-50 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-[#0a3fa8] rounded-full flex items-center justify-center text-white">
                                                    {method.type === 'credit_card' ? '💳' : '🏦'}
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {method.type === 'credit_card' ? 'Credit Card' : 'Bank Account'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        **** **** **** {method.last4}
                                                    </p>
                                                </div>
                                            </div>
                                            {method.isDefault && (
                                                <span className="px-2 py-1 text-xs font-medium text-[#0a3fa8] bg-blue-100 rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        {method.expiryDate && (
                                            <p className="text-sm text-gray-500">
                                                Expires: {method.expiryDate}
                                            </p>
                                        )}
                                        <div className="mt-4 flex space-x-2">
                                            <button className="text-sm text-[#0a3fa8] hover:text-[#083080]">
                                                Edit
                                            </button>
                                            <button className="text-sm text-red-600 hover:text-red-700">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Claims Tab */}
                    {selectedTab === 'claims' && (
                        <div className="mt-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {claims.map((claim) => (
                                            <tr key={claim.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(claim.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {claim.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(claim.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {claim.claimNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                                                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Payment Method Modal */}
            {showAddPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Add Payment Method</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                                <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]">
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="bank_account">Bank Account</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                    placeholder="1234 5678 9012 3456"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        placeholder="123"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => setShowAddPaymentModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-[#0a3fa8] text-white rounded-lg hover:bg-[#083080]">
                                Add Payment Method
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pay Bill Modal */}
            {showPayBillModal && selectedBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay Bill</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-900">{selectedBill.description}</h4>
                                <p className="text-2xl font-bold text-[#0a3fa8] mt-2">
                                    {formatCurrency(selectedBill.amount)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Due Date: {new Date(selectedBill.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]">
                                    {paymentMethods.map((method) => (
                                        <option key={method.id}>
                                            {method.type === 'credit_card' ? 'Credit Card' : 'Bank Account'} ending in {method.last4}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => setShowPayBillModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-[#0a3fa8] text-white rounded-lg hover:bg-[#083080]">
                                Pay {formatCurrency(selectedBill.amount)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-500">
                        <p>© 1998 - 2025 Mayo Foundation for Medical Education and Research. All rights reserved.</p>
                        <p className="mt-2">
                            <Link href="#" className="hover:underline">LEGAL RESTRICTIONS AND TERMS OF USE</Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 