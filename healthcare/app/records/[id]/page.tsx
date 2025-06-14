"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import Link from 'next/link';
import Image from 'next/image';
import { MedicalRecord } from '../../services/auth';

export default function MedicalRecordDetailPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [record, setRecord] = useState<MedicalRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchRecord = async () => {
            try {
                setIsLoading(true);
                const id = Number(params.id);
                if (isNaN(id)) {
                    throw new Error('Invalid record ID');
                }
                const data = await authService.getMedicalRecord(id);
                setRecord(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch record');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecord();
    }, [isAuthenticated, router, params.id]);

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
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <ol className="flex space-x-2 text-sm text-gray-500">
                        <li>
                            <Link href="/records" className="hover:text-[#0a3fa8] hover:underline">Medical Records</Link>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-[#0a3fa8] font-medium">
                            {isLoading ? 'Loading...' : record?.type || 'Record Details'}
                        </li>
                    </ol>
                </nav>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3fa8] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading record details...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-red-600 mb-4 text-xl">Error</div>
                        <p className="text-gray-700">{error}</p>
                        <Link href="/records" className="mt-6 inline-block bg-[#0a3fa8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#083080] transition-colors">
                            Back to Records
                        </Link>
                    </div>
                ) : record ? (
                    <>
                        {/* Record Header */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-[#0a3fa8] mb-2">{record.type}</h1>
                                    <p className="text-gray-600 text-lg">{record.date}</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button className="bg-[#0a3fa8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#083080] transition-colors">
                                        Download
                                    </button>
                                    <button className="border border-[#0a3fa8] text-[#0a3fa8] px-6 py-3 rounded-full font-bold hover:bg-[#0a3fa8] hover:text-white transition-colors">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Record Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Provider</h3>
                                        <p className="text-lg font-medium text-gray-900">{record.provider}</p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                                        <p className="text-lg font-medium text-gray-900">{record.department}</p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
                                        <p className="text-lg font-medium text-gray-900">{record.date}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Record ID</h3>
                                        <p className="text-lg font-medium text-gray-900">#{record.id}</p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                                        <p className="text-lg font-medium text-gray-900">{record.createdAt}</p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                                        <p className="text-lg font-medium text-gray-900">{record.updatedAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
                            <div className="prose max-w-none text-gray-700">
                                <p>{record.summary}</p>
                            </div>
                        </div>

                        {/* Attachments */}
                        {record.attachments > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Attachments</h2>
                                <div className="space-y-4">
                                    {Array.from({ length: record.attachments }).map((_, index) => (
                                        <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                                            <div className="bg-gray-100 p-3 rounded-lg mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Attachment {index + 1}</p>
                                                <p className="text-sm text-gray-500">PDF Document</p>
                                            </div>
                                            <button className="text-[#0a3fa8] hover:underline">Download</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between mt-8">
                            <Link href="/records" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
                                Back to Records
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <p className="text-gray-700">Record not found</p>
                        <Link href="/records" className="mt-6 inline-block bg-[#0a3fa8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#083080] transition-colors">
                            Back to Records
                        </Link>
                    </div>
                )}
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