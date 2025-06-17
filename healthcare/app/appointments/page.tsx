"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { appointmentService, Appointment } from '../services/appointment';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';
import DashboardHeader from '../components/DashboardHeader';

type SortField = 'date' | 'type' | 'doctor';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'scheduled' | 'completed' | 'cancelled';
type ViewMode = 'list' | 'calendar';

interface AppointmentWithDetails extends Appointment {
    doctor: string;
    department: string;
    location: string;
}

export default function AppointmentsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState<number | null>(null);
    const [isRescheduling, setIsRescheduling] = useState<number | null>(null);
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);

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
            // Transform the data to include doctor and location details
            const appointmentsWithDetails: AppointmentWithDetails[] = await Promise.all(
                data.map(async (appointment) => {
                    // In a real application, you would fetch these details from your API
                    // For now, we'll use mock data
                    return {
                        ...appointment,
                        doctor: `Dr. Smith`, // This would come from your API
                        department: 'Cardiology', // This would come from your API
                        location: 'Main Hospital - Floor 3' // This would come from your API
                    };
                })
            );
            setAppointments(appointmentsWithDetails);
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

    const handleReschedule = async (id: number, date: string, time: string) => {
        setIsRescheduling(id);
        try {
            await appointmentService.updateAppointment(id, { date, time });
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

        // Apply date filter
        if (selectedDate) {
            filtered = filtered.filter(app => app.date === selectedDate);
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
    }, [appointments, sortField, sortOrder, statusFilter, searchQuery, selectedDate]);

    const getUpcomingAppointments = () => {
        const today = new Date();
        return appointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate >= today && app.status !== 'cancelled' && app.status !== 'completed';
        });
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDayOfMonth };
    };

    const getAppointmentsForDate = (date: string) => {
        return appointments.filter(app => app.date === date);
    };

    const renderCalendarView = () => {
        const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
        const days = [];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppointments = getAppointmentsForDate(date);
            const isToday = new Date().toDateString() === new Date(date).toDateString();

            days.push(
                <div
                    key={day}
                    className={`h-24 border border-gray-100 p-2 ${isToday ? 'bg-blue-50' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {day}
                        </span>
                        {dayAppointments.length > 0 && (
                            <span className="text-xs font-medium text-blue-600">
                                {dayAppointments.length} {dayAppointments.length === 1 ? 'appointment' : 'appointments'}
                            </span>
                        )}
                    </div>
                    <div className="mt-1 space-y-1">
                        {dayAppointments.slice(0, 2).map(app => (
                            <div
                                key={app.id}
                                onClick={() => {
                                    setSelectedAppointment(app);
                                    setShowReminderModal(true);
                                }}
                                className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                            >
                                {app.time} - {app.type}
                            </div>
                        ))}
                        {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500">
                                +{dayAppointments.length - 2} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentMonth(new Date())}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-white p-2 text-center text-sm font-medium text-gray-900">
                            {day}
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{appointments.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                            {getUpcomingAppointments().length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            {appointments.filter(app => app.status === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                            {appointments.filter(app => app.status === 'cancelled').length}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filters
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0a3fa8] rounded-lg hover:bg-[#083080] transition-colors"
                                >
                                    Schedule New Appointment
                                </button>
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
                                            placeholder="Search appointments..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                            setSelectedDate('');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-b border-red-200 text-red-600">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3fa8]"></div>
                        </div>
                    ) : viewMode === 'calendar' ? renderCalendarView() : filteredAndSortedAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                            <p className="text-gray-500 mb-4">
                                {appointments.length === 0
                                    ? "You don't have any appointments scheduled."
                                    : "No appointments match your search criteria."}
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0a3fa8] hover:bg-[#083080] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a3fa8]"
                            >
                                Schedule New Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredAndSortedAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{appointment.type}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Doctor</p>
                                                    <p className="font-medium text-gray-900">{appointment.doctor}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Date & Time</p>
                                                    <p className="font-medium text-gray-900">{appointment.date} • {appointment.time}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Location</p>
                                                    <p className="font-medium text-gray-900">{appointment.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setIsRescheduling(appointment.id)}
                                                    disabled={isRescheduling === appointment.id}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a3fa8] disabled:opacity-50"
                                                >
                                                    {isRescheduling === appointment.id ? 'Rescheduling...' : 'Reschedule'}
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(appointment.id)}
                                                    disabled={isCancelling === appointment.id}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    {isCancelling === appointment.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {isModalOpen && (
                <ScheduleAppointmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSchedule={fetchAppointments}
                />
            )}
            {isRescheduling && (
                <RescheduleAppointmentModal
                    isOpen={!!isRescheduling}
                    onClose={() => setIsRescheduling(null)}
                    appointmentId={isRescheduling}
                    onReschedule={handleReschedule}
                />
            )}

            {/* Reminder Modal */}
            {showReminderModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                            <button
                                onClick={() => setShowReminderModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Type</p>
                                <p className="font-medium text-gray-900">{selectedAppointment.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Doctor</p>
                                <p className="font-medium text-gray-900">{selectedAppointment.doctor}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-medium text-gray-900">{selectedAppointment.date} • {selectedAppointment.time}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-900">{selectedAppointment.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedAppointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                    selectedAppointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowReminderModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowReminderModal(false);
                                            setIsRescheduling(selectedAppointment.id);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-[#0a3fa8] bg-white border border-[#0a3fa8] rounded-lg hover:bg-blue-50"
                                    >
                                        Reschedule
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReminderModal(false);
                                            handleCancel(selectedAppointment.id);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
