"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
    const { user, isAuthenticated, activities, refreshActivities } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            refreshActivities();
        }
    }, [isAuthenticated, router, refreshActivities]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const quickActions = [
        { title: 'Update Profile', href: '/profile', icon: '👤' },
        { title: 'View Appointments', href: '/appointments', icon: '📅' },
        { title: 'Medical Records', href: '/records', icon: '📋' },
        { title: 'Messages', href: '#', icon: '✉️' },
        { title: 'Bio Information', href: '/bio', icon: '🧬' },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'profile_update':
                return '📝';
            case 'login':
                return '🔑';
            case 'logout':
                return '🚪';
            default:
                return '📌';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f6f7] font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Image src="/ciptahospitallogo.svg" alt="Cipta Hospital" width={48} height={48} />
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user.firstName}</span>
                        <Link href="/profile" className="text-[#0a3fa8] hover:underline">View Profile</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-extrabold text-[#0a3fa8] mb-4">Welcome to Your Dashboard</h1>
                    <p className="text-gray-600 text-lg">Here&apos;s an overview of your account and recent activities.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="text-4xl mb-4">{action.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900">{action.title}</h3>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity and Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4">
                                        <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {activity.type === 'profile_update' ? 'Profile Updated' :
                                                    activity.type === 'login' ? 'Logged In' :
                                                        activity.type === 'logout' ? 'Logged Out' :
                                                            activity.type}
                                            </h4>
                                            <p className="text-sm text-gray-500">{formatDate(activity.createdAt)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No recent activities</p>
                            )}
                        </div>
                    </div>

                    {/* Account Stats */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500">Account Status</h4>
                                <p className="text-lg font-bold text-green-600">Active</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500">Member Since</h4>
                                <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500">Role</h4>
                                <p className="text-lg font-bold text-gray-900">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-500">
                        <p>© 1998 - 2025 Cipta Foundation for Medical Education and Research. All rights reserved.</p>
                        <p className="mt-2">
                            <Link href="#" className="hover:underline">LEGAL RESTRICTIONS AND TERMS OF USE</Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 
