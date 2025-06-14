"use client";

import { useState } from 'react';
import { appointmentService, CreateAppointmentInput } from '../services/appointment';

interface ScheduleAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ScheduleAppointmentModal({ isOpen, onClose, onSuccess }: ScheduleAppointmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<CreateAppointmentInput>({
        type: '',
        doctor: '',
        department: '',
        date: '',
        time: '',
        location: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await appointmentService.createAppointment(formData);
            onSuccess();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to schedule appointment');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Schedule New Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Appointment Type
                        </label>
                        <input
                            id="type"
                            type="text"
                            required
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                            placeholder="e.g., Annual Physical Checkup"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                                Doctor
                            </label>
                            <input
                                id="doctor"
                                type="text"
                                required
                                value={formData.doctor}
                                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                placeholder="e.g., Dr. Sarah Johnson"
                            />
                        </div>

                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <input
                                id="department"
                                type="text"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                placeholder="e.g., Cardiology"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                            </label>
                            <input
                                id="time"
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                            placeholder="e.g., Mayo Clinic - Main Campus"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#0a3fa8] hover:bg-[#083080] text-white font-medium py-2 px-5 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
