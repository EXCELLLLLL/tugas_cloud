"use client";

import { useState } from 'react';
import { appointmentService } from '../services/appointment';

interface RescheduleAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    appointmentId: number;
    currentDate: string;
    currentTime: string;
}

export default function RescheduleAppointmentModal({
    isOpen,
    onClose,
    onSuccess,
    appointmentId,
    currentDate,
    currentTime,
}: RescheduleAppointmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [date, setDate] = useState(currentDate);
    const [time, setTime] = useState(currentTime);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await appointmentService.rescheduleAppointment(appointmentId, date, time);
            onSuccess();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to reschedule appointment');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Reschedule Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="date" className="block text-base font-bold text-gray-900 mb-1">
                            New Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-base font-bold text-gray-900 mb-1">
                            New Time
                        </label>
                        <input
                            id="time"
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#0a3fa8] hover:bg-[#083080] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Rescheduling...' : 'Reschedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 