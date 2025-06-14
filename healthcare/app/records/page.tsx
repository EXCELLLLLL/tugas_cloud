"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { authService, MedicalRecord } from '../services/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function RecordsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchRecords = async () => {
            try {
                // Try to fetch from API first
                try {
                    const data = await authService.getMedicalRecords();
                    setRecords(data);
                } catch (apiError) {
                    console.error('API fetch failed, using mock data:', apiError);
                    // Fallback to simulated medical records data if API fails
                    setRecords([
                        {
                            id: 1,
                            date: '2024-03-15',
                            type: 'Lab Results',
                            provider: 'Dr. Sarah Johnson',
                            department: 'Cardiology',
                            summary: 'Complete blood count and lipid panel results',
                            attachments: 2,
                            createdAt: '2024-03-15T10:30:00Z',
                            updatedAt: '2024-03-15T10:30:00Z'
                        },
                        {
                            id: 2,
                            date: '2024-03-10',
                            type: 'Imaging Report',
                            provider: 'Dr. Michael Chen',
                            department: 'Radiology',
                            summary: 'Chest X-ray examination results',
                            attachments: 1,
                            createdAt: '2024-03-10T14:15:00Z',
                            updatedAt: '2024-03-10T14:15:00Z'
                        },
                        {
                            id: 3,
                            date: '2024-03-05',
                            type: 'Consultation Note',
                            provider: 'Dr. Emily Brown',
                            department: 'Orthopedics',
                            summary: 'Follow-up consultation for knee pain',
                            attachments: 0,
                            createdAt: '2024-03-05T09:45:00Z',
                            updatedAt: '2024-03-05T09:45:00Z'
                        }
                    ]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch records');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f5f6f7] font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Image src="/mayo-logo.svg" alt="Mayo Clinic" width={40} height={40} />
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="text-[#0a3fa8] hover:underline">Dashboard</Link>
                        <Link href="/profile" className="text-[#0a3fa8] hover:underline">Profile</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#0a3fa8] mb-2">Medical Records</h1>
                            <p className="text-gray-600">View and manage your medical records and test results</p>
                        </div>
                        <div className="flex space-x-4">
                            <button className="bg-[#0a3fa8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#083080] transition-colors">
                                Request Records
                            </button>
                            <button className="border border-[#0a3fa8] text-[#0a3fa8] px-6 py-3 rounded-full font-bold hover:bg-[#0a3fa8] hover:text-white transition-colors">
                                Download All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Records List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Records</h2>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a3fa8] focus:border-transparent"
                            />
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a3fa8] focus:border-transparent">
                                <option value="">All Types</option>
                                <option value="lab">Lab Results</option>
                                <option value="imaging">Imaging</option>
                                <option value="consultation">Consultation</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3fa8] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading records...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="text-red-600 mb-4 text-xl">Error</div>
                            <p className="text-gray-700">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="mt-6 inline-block bg-[#0a3fa8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#083080] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {records.map((record) => (
                                <div key={record.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{record.type}</h3>
                                            <p className="text-gray-600 mt-1">{record.provider}</p>
                                            <p className="text-gray-500 mt-1">{record.department}</p>
                                            <p className="text-gray-700 mt-2">{record.summary}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-gray-900 font-semibold">{record.date}</p>
                                            {record.attachments > 0 && (
                                                <p className="text-[#0a3fa8] mt-2">
                                                    {record.attachments} attachment{record.attachments > 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-4">
                                        <Link href={`/records/${record.id}`} className="text-[#0a3fa8] hover:underline">View Details</Link>
                                        <button className="text-[#0a3fa8] hover:underline">Download</button>
                                        <button className="text-[#0a3fa8] hover:underline">Share</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
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
