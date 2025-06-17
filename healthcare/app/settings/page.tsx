"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import Link from 'next/link';

export default function SettingsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        appointmentReminders: true,
        marketingUpdates: false
    });
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('UTC');
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSuccess('');
        setError('');

        try {
            // Here you would typically save the settings to your backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            setSuccess('Settings saved successfully');
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-b border-red-200">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-green-50 border-b border-green-200">
                                <p className="text-sm text-green-600">{success}</p>
                            </div>
                        )}

                        <div className="p-6 space-y-8">
                            {/* Notifications Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationChange('email')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notifications.email ? 'bg-[#0a3fa8]' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications.email ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                                            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationChange('sms')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notifications.sms ? 'bg-[#0a3fa8]' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications.sms ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Appointment Reminders</label>
                                            <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationChange('appointmentReminders')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notifications.appointmentReminders ? 'bg-[#0a3fa8]' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications.appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Appearance Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                                        <select
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                            <option value="system">System</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Language & Region Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Language & Region</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="EST">Eastern Time</option>
                                            <option value="CST">Central Time</option>
                                            <option value="PST">Pacific Time</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/profile"
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-[#0a3fa8] text-white rounded-lg font-medium hover:bg-[#083080] disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t bg-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-500">
                        <Link href="#" className="hover:text-gray-900">LEGAL RESTRICTIONS AND TERMS OF USE APPLICABLE TO THIS SITE</Link>
                        <p className="mt-1">Use of this site signifies your agreement to the terms of use.</p>
                        <p className="mt-1">© 1998 - 2025 Mayo Foundation for Medical Education and Research. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 