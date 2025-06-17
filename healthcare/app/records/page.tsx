"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { authService, MedicalRecord } from '../services/auth';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';

type RecordType = 'all' | 'lab' | 'imaging' | 'consultation' | 'prescription';
type SortField = 'date' | 'type' | 'provider';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'list' | 'timeline';

interface RecordCategory {
    id: string;
    name: string;
    color: string;
    icon: string;
}

const RECORD_CATEGORIES: RecordCategory[] = [
    { id: 'lab', name: 'Lab Results', color: 'blue', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'imaging', name: 'Imaging Reports', color: 'green', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'consultation', name: 'Consultations', color: 'purple', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
    { id: 'prescription', name: 'Prescriptions', color: 'yellow', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
];

export default function RecordsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [recordType, setRecordType] = useState<RecordType>('all');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [showRecordDetails, setShowRecordDetails] = useState(false);
    const [shareHistory] = useState<{ email: string; date: string; recordId: number }[]>([]);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchRecords = async () => {
            try {
                const data = await authService.getMedicalRecords();
                setRecords(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch records');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [isAuthenticated, router]);

    const filteredAndSortedRecords = useMemo(() => {
        let filtered = records;

        // Apply type filter
        if (recordType !== 'all') {
            filtered = filtered.filter(record => record.category === recordType);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(record =>
                record.type.toLowerCase().includes(query) ||
                record.provider.toLowerCase().includes(query) ||
                record.department.toLowerCase().includes(query) ||
                record.summary.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        return [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                case 'provider':
                    comparison = a.provider.localeCompare(b.provider);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [records, recordType, searchQuery, sortField, sortOrder]);

    const recordStats = useMemo(() => {
        const total = records.length;
        const labResults = records.filter(r => r.category === 'lab').length;
        const imagingReports = records.filter(r => r.category === 'imaging').length;
        const consultations = records.filter(r => r.category === 'consultation').length;
        const prescriptions = records.filter(r => r.category === 'prescription').length;

        return { total, labResults, imagingReports, consultations, prescriptions };
    }, [records]);

    const renderTimelineView = () => {
        const groupedRecords = filteredAndSortedRecords.reduce((acc, record) => {
            const month = new Date(record.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(record);
            return acc;
        }, {} as Record<string, MedicalRecord[]>);

        return (
            <div className="space-y-8">
                {Object.entries(groupedRecords).map(([month, monthRecords]) => (
                    <div key={month}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{month}</h3>
                        <div className="space-y-4">
                            {monthRecords.map((record) => (
                                <div key={record.id} className="relative pl-8 pb-8">
                                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-[#0a3fa8] -translate-x-1/2"></div>
                                    <div className="absolute left-0 top-4 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
                                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-2 rounded-lg bg-${RECORD_CATEGORIES.find(c => c.id === record.category)?.color}-100`}>
                                                <svg className={`w-6 h-6 text-${RECORD_CATEGORIES.find(c => c.id === record.category)?.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={RECORD_CATEGORIES.find(c => c.id === record.category)?.icon} />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">{record.type}</h4>
                                                <p className="text-sm text-gray-500">{record.date}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Provider</p>
                                                <p className="font-medium text-gray-900">{record.provider}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Department</p>
                                                <p className="font-medium text-gray-900">{record.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className="font-medium text-gray-900">{record.status}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">{record.summary}</p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedRecord(record);
                                                    setShowRecordDetails(true);
                                                }}
                                                className="text-[#0a3fa8] hover:text-[#083080] font-medium"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedRecord(record);
                                                    setShowShareModal(true);
                                                }}
                                                className="text-[#0a3fa8] hover:text-[#083080] font-medium"
                                            >
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {RECORD_CATEGORIES.map((category) => (
                        <div key={category.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                                    <svg className={`w-6 h-6 text-${category.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">{category.name}</h3>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {records.filter(r => r.category === category.id).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
                                <p className="text-gray-600 mt-1">View and manage your medical records and test results</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('timeline')}
                                        className={`p-2 rounded-lg ${viewMode === 'timeline' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filters
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => {/* Handle export */ }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#0a3fa8] rounded-lg hover:bg-[#083080] transition-colors"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search records..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                                        <select
                                            value={recordType}
                                            onChange={(e) => setRecordType(e.target.value as RecordType)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="lab">Lab Results</option>
                                            <option value="imaging">Imaging Reports</option>
                                            <option value="consultation">Consultations</option>
                                            <option value="prescription">Prescriptions</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={sortField}
                                                onChange={(e) => setSortField(e.target.value as SortField)}
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                            >
                                                <option value="date">Date</option>
                                                <option value="type">Type</option>
                                                <option value="provider">Provider</option>
                                            </select>
                                            <button
                                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50"
                                            >
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setRecordType('all');
                                            setSortField('date');
                                            setSortOrder('desc');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3fa8]"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <div className="text-red-600 mb-4 text-xl">Error</div>
                            <p className="text-gray-700">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 inline-block bg-[#0a3fa8] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#083080] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredAndSortedRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                            <p className="text-gray-500">
                                {records.length === 0
                                    ? "You don't have any medical records yet."
                                    : "No records match your search criteria."}
                            </p>
                        </div>
                    ) : viewMode === 'timeline' ? (
                        renderTimelineView()
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredAndSortedRecords.map((record) => (
                                <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{record.type}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'final' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'preliminary' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Provider</p>
                                                    <p className="font-medium text-gray-900">{record.provider}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Department</p>
                                                    <p className="font-medium text-gray-900">{record.department}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="font-medium text-gray-900">{record.date}</p>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-gray-700">{record.summary}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {record.attachments > 0 && (
                                                <span className="text-sm text-[#0a3fa8]">
                                                    {record.attachments} attachment{record.attachments > 1 ? 's' : ''}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRecord(record);
                                                        setShowRecordDetails(true);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-[#0a3fa8] rounded-lg hover:bg-gray-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {/* Handle download */ }}
                                                    className="p-2 text-gray-600 hover:text-[#0a3fa8] rounded-lg hover:bg-gray-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRecord(record);
                                                        setShowShareModal(true);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-[#0a3fa8] rounded-lg hover:bg-gray-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Record Details Modal */}
            {showRecordDetails && selectedRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-${RECORD_CATEGORIES.find(c => c.id === selectedRecord.category)?.color}-100`}>
                                    <svg className={`w-8 h-8 text-${RECORD_CATEGORIES.find(c => c.id === selectedRecord.category)?.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={RECORD_CATEGORIES.find(c => c.id === selectedRecord.category)?.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{selectedRecord.type}</h3>
                                    <p className="text-sm text-gray-500">{selectedRecord.date}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRecordDetails(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Provider</h4>
                                    <p className="text-gray-900">{selectedRecord.provider}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Department</h4>
                                    <p className="text-gray-900">{selectedRecord.department}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                                    <p className="text-gray-900">{selectedRecord.status}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
                                    <p className="text-gray-900">{selectedRecord.attachments} file(s)</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Summary</h4>
                                <p className="text-gray-900">{selectedRecord.summary}</p>
                            </div>
                            {selectedRecord.attachments > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Attached Files</h4>
                                    <div className="space-y-2">
                                        {/* Add attachment list here */}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowRecordDetails(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRecordDetails(false);
                                        setShowShareModal(true);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0a3fa8] rounded-lg hover:bg-[#083080]"
                                >
                                    Share Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && selectedRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Share Record</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                <textarea
                                    placeholder="Add a message..."
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                ></textarea>
                            </div>
                            {shareHistory.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Share History</h4>
                                    <div className="space-y-2">
                                        {shareHistory.map((share, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{share.email}</span>
                                                <span className="text-gray-500">{share.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle share
                                    setShowShareModal(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#0a3fa8] rounded-lg hover:bg-[#083080]"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
