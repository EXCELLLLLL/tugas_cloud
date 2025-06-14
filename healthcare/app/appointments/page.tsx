"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { appointmentService, Appointment } from '../services/appointment';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';

type SortField = 'date' | 'type' | 'doctor';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState<number | null>(null);
    const [isRescheduling, setIsRescheduling] = useState<number | null>(null);
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            fetchAppointments();
        }
    }, [isAuthenticated, router]);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getAppointments();
            setAppointments(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to fetch appointments');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        setIsCancelling(id);
        try {
            await appointmentService.cancelAppointment(id);
            await fetchAppointments();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to cancel appointment');
            }
        } finally {
            setIsCancelling(null);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleReschedule = async (id: number, date: string, time: string) => {
        setIsRescheduling(id);
        try {
            await appointmentService.rescheduleAppointment(id, date, time);
            await fetchAppointments();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to reschedule appointment');
            }
        } finally {
            setIsRescheduling(null);
        }
    };

    const filteredAndSortedAppointments = useMemo(() => {
        let filtered = appointments;

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(app =>
                app.type.toLowerCase().includes(query) ||
                app.doctor.toLowerCase().includes(query) ||
                app.department.toLowerCase().includes(query) ||
                app.location.toLowerCase().includes(query)
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
                case 'doctor':
                    comparison = a.doctor.localeCompare(b.doctor);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [appointments, sortField, sortOrder, statusFilter, searchQuery]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Main content wrapper */}
            <div className="flex flex-1 min-h-[80vh]">
                {/* Left: Appointments List */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10 mx-4 mt-12 mb-8 border border-gray-100">
                        <div className="flex flex-col items-center mb-6">
                            <Image src="/mayo-logo.svg" alt="Mayo Clinic" width={48} height={48} className="mb-2" />
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Your Appointments</h1>
                            <p className="text-lg font-semibold text-[#0a3fa8] text-center">View and manage your upcoming appointments</p>
                        </div>

                        {/* Filters and Search */}
                        <div className="mb-6 space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <input
                                        type="text"
                                        placeholder="Search appointments..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="flex gap-2">
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value as SortField)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                    >
                                        <option value="date">Sort by Date</option>
                                        <option value="type">Sort by Type</option>
                                        <option value="doctor">Sort by Doctor</option>
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

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                {error}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3fa8]"></div>
                            </div>
                        ) : filteredAndSortedAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg mb-4">
                                    {appointments.length === 0
                                        ? "You don't have any appointments scheduled."
                                        : "No appointments match your search criteria."}
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#0a3fa8] hover:bg-[#083080] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-md"
                                >
                                    Schedule New Appointment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAndSortedAppointments.map((appointment) => (
                                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{appointment.type}</h3>
                                                <p className="text-gray-600">{appointment.doctor}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${appointment.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Date & Time</p>
                                                <p className="font-semibold">{appointment.date} • {appointment.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-semibold">{appointment.location}</p>
                                            </div>
                                        </div>
                                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                            <div className="mt-4 flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setIsRescheduling(appointment.id)}
                                                    disabled={isRescheduling === appointment.id}
                                                    className="px-4 py-2 text-sm font-semibold text-[#0a3fa8] hover:underline disabled:opacity-50"
                                                >
                                                    Reschedule
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(appointment.id)}
                                                    disabled={isCancelling === appointment.id}
                                                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                                                >
                                                    {isCancelling === appointment.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full border-t bg-gray-50 py-6 text-center text-xs text-gray-600 font-semibold">
                <div>
                    <a href="#" className="hover:underline">LEGAL RESTRICTIONS AND TERMS OF USE APPLICABLE TO THIS SITE</a>
                </div>
                <div className="mt-1">Use of this site signifies your agreement to the terms of use.</div>
                <div className="mt-1">© 1998 - 2025 Mayo Foundation for Medical Education and Research. All rights reserved.</div>
            </footer>

            {/* Schedule Appointment Modal */}
            <ScheduleAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
            />

            {/* Reschedule Appointment Modal */}
            {isRescheduling && (
                <RescheduleAppointmentModal
                    isOpen={true}
                    onClose={() => setIsRescheduling(null)}
                    onSuccess={fetchAppointments}
                    appointmentId={isRescheduling}
                    currentDate={appointments.find(a => a.id === isRescheduling)?.date || ''}
                    currentTime={appointments.find(a => a.id === isRescheduling)?.time || ''}
                />
            )}
        </div>
    );
} 
