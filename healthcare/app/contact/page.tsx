"use client";

import { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-[#f5f6f7] font-sans">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Contact Form Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-[#0a3fa8] mb-6 text-center">Contact Us</h1>
                        <p className="text-gray-600 mb-8 text-center">
                            Have questions or need assistance? We&apos;re here to help.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0a3fa8] focus:border-[#0a3fa8]"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0a3fa8] focus:border-[#0a3fa8]"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0a3fa8] focus:border-[#0a3fa8]"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0a3fa8] focus:border-[#0a3fa8]"
                                    placeholder="Your message..."
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-[#0a3fa8] text-white rounded-lg hover:bg-[#083080] transition-colors"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">📍</span>
                            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                        </div>
                        <p className="text-gray-600">
                            123 Healthcare Avenue<br />
                            Medical District<br />
                            City, State 12345
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">📞</span>
                            <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                        </div>
                        <p className="text-gray-600">
                            Main: (555) 123-4567<br />
                            Support: (555) 987-6543
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">✉️</span>
                            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                        </div>
                        <p className="text-gray-600">
                            General: info@healthcare.com<br />
                            Support: support@healthcare.com
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
} 