"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import OnlineUsers from '../components/OnlineUsers';
import DashboardHeader from '../components/DashboardHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthMetric {
    name: string;
    value: string;
    unit: string;
    trend: 'up' | 'down' | 'neutral';
    lastUpdated: string;
    history?: { date: string; value: number }[];
}

interface Appointment {
    id: number;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    type: 'checkup' | 'followup' | 'consultation';
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
}

interface HealthTip {
    id: number;
    title: string;
    description: string;
    category: string;
    read: boolean;
    priority: 'high' | 'medium' | 'low';
    actionRequired: boolean;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    timestamp: string;
    read: boolean;
}

interface Medication {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    nextDose: string;
    remaining: number;
    refillNeeded: boolean;
    notes?: string;
}

interface EmergencyContact {
    id: number;
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
}

interface HealthJournal {
    id: number;
    date: string;
    mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
    symptoms: string[];
    notes: string;
    activities: string[];
}

export default function DashboardPage() {
    const { user, isAuthenticated, activities, refreshActivities } = useAuth();
    const router = useRouter();
    const [selectedTimeRange, setSelectedTimeRange] = useState('week');
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showQuickBookModal, setShowQuickBookModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [newJournalEntry, setNewJournalEntry] = useState<Partial<HealthJournal>>({
        mood: 'neutral',
        symptoms: [],
        notes: '',
        activities: []
    });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Health Metrics Data with History
    const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
        {
            name: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            trend: 'neutral',
            lastUpdated: '2024-03-15',
            history: [
                { date: '2024-03-10', value: 125 },
                { date: '2024-03-11', value: 122 },
                { date: '2024-03-12', value: 120 },
                { date: '2024-03-13', value: 118 },
                { date: '2024-03-14', value: 120 },
                { date: '2024-03-15', value: 120 }
            ]
        },
        {
            name: 'Heart Rate',
            value: '72',
            unit: 'bpm',
            trend: 'down',
            lastUpdated: '2024-03-15',
            history: [
                { date: '2024-03-10', value: 75 },
                { date: '2024-03-11', value: 74 },
                { date: '2024-03-12', value: 73 },
                { date: '2024-03-13', value: 72 },
                { date: '2024-03-14', value: 71 },
                { date: '2024-03-15', value: 72 }
            ]
        },
        {
            name: 'Blood Sugar',
            value: '95',
            unit: 'mg/dL',
            trend: 'up',
            lastUpdated: '2024-03-15',
            history: [
                { date: '2024-03-10', value: 92 },
                { date: '2024-03-11', value: 93 },
                { date: '2024-03-12', value: 94 },
                { date: '2024-03-13', value: 95 },
                { date: '2024-03-14', value: 94 },
                { date: '2024-03-15', value: 95 }
            ]
        },
        {
            name: 'Weight',
            value: '70',
            unit: 'kg',
            trend: 'down',
            lastUpdated: '2024-03-15',
            history: [
                { date: '2024-03-10', value: 71 },
                { date: '2024-03-11', value: 70.8 },
                { date: '2024-03-12', value: 70.5 },
                { date: '2024-03-13', value: 70.3 },
                { date: '2024-03-14', value: 70.1 },
                { date: '2024-03-15', value: 70 }
            ]
        }
    ]);

    // Upcoming Appointments with Enhanced Data
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: 1,
            doctorName: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: '2024-03-20',
            time: '10:00 AM',
            type: 'checkup',
            status: 'scheduled',
            notes: 'Annual heart checkup with ECG'
        },
        {
            id: 2,
            doctorName: 'Dr. Michael Chen',
            specialty: 'Primary Care',
            date: '2024-03-25',
            time: '2:30 PM',
            type: 'followup',
            status: 'scheduled',
            notes: 'Follow-up on blood pressure medication'
        }
    ]);

    // Enhanced Health Tips
    const [healthTips, setHealthTips] = useState<HealthTip[]>([
        {
            id: 1,
            title: 'Stay Hydrated',
            description: 'Drink at least 8 glasses of water daily for optimal health.',
            category: 'Wellness',
            read: false,
            priority: 'high',
            actionRequired: true
        },
        {
            id: 2,
            title: 'Exercise Regularly',
            description: 'Aim for 30 minutes of moderate exercise 5 days a week.',
            category: 'Fitness',
            read: false,
            priority: 'medium',
            actionRequired: true
        },
        {
            id: 3,
            title: 'Medication Reminder',
            description: 'Don\'t forget to take your blood pressure medication at 8 PM.',
            category: 'Medication',
            read: false,
            priority: 'high',
            actionRequired: true
        }
    ]);

    // Medications
    const [medications, setMedications] = useState<Medication[]>([
        {
            id: 1,
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            nextDose: '2024-03-20 08:00',
            remaining: 15,
            refillNeeded: true,
            notes: 'Take with breakfast'
        },
        {
            id: 2,
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            nextDose: '2024-03-20 12:00',
            remaining: 30,
            refillNeeded: false,
            notes: 'Take with meals'
        }
    ]);

    // Emergency Contacts
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
        {
            id: 1,
            name: 'John Smith',
            relationship: 'Spouse',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@email.com',
            isPrimary: true
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            relationship: 'Sister',
            phone: '+1 (555) 987-6543',
            email: 'sarah.j@email.com',
            isPrimary: false
        }
    ]);

    // Health Journal
    const [healthJournal, setHealthJournal] = useState<HealthJournal[]>([
        {
            id: 1,
            date: '2024-03-19',
            mood: 'good',
            symptoms: ['Mild headache', 'Fatigue'],
            notes: 'Feeling better today. Exercised for 30 minutes.',
            activities: ['Morning walk', 'Yoga', 'Work']
        },
        {
            id: 2,
            date: '2024-03-18',
            mood: 'neutral',
            symptoms: ['Headache', 'Sore throat'],
            notes: 'Resting most of the day. Took prescribed medication.',
            activities: ['Rest', 'Reading', 'Light stretching']
        }
    ]);

    // Sample Notifications
    useEffect(() => {
        setNotifications([
            {
                id: 1,
                title: 'Appointment Reminder',
                message: 'Your appointment with Dr. Johnson is tomorrow at 10:00 AM',
                type: 'info',
                timestamp: '2024-03-19T10:00:00',
                read: false
            },
            {
                id: 2,
                title: 'Test Results Available',
                message: 'Your blood test results from March 15 are now available',
                type: 'success',
                timestamp: '2024-03-19T09:30:00',
                read: false
            },
            {
                id: 3,
                title: 'Medication Alert',
                message: 'Time to refill your prescription for blood pressure medication',
                type: 'warning',
                timestamp: '2024-03-19T09:00:00',
                read: false
            }
        ]);
    }, []);

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

    // Enhanced Stats with More Details
    const stats = [
        {
            title: 'Total Patients',
            value: '156',
            change: '+12%',
            changeType: 'increase',
            period: 'Today',
            icon: '👥',
            color: 'bg-blue-50 text-blue-600',
            details: '1,245 this week',
            subDetails: 'New: 45, Returning: 111',
            trend: [
                { date: 'Mon', value: 120 },
                { date: 'Tue', value: 132 },
                { date: 'Wed', value: 145 },
                { date: 'Thu', value: 138 },
                { date: 'Fri', value: 156 }
            ]
        },
        {
            title: 'Appointments',
            value: '48',
            change: '+5%',
            changeType: 'increase',
            period: 'Today',
            icon: '📅',
            color: 'bg-green-50 text-green-600',
            details: '32 upcoming, 2 missed',
            subDetails: 'Completed: 14, Cancelled: 3',
            trend: [
                { date: 'Mon', value: 42 },
                { date: 'Tue', value: 45 },
                { date: 'Wed', value: 43 },
                { date: 'Thu', value: 46 },
                { date: 'Fri', value: 48 }
            ]
        },
        {
            title: 'Bed Occupancy',
            value: '85%',
            change: '-2%',
            changeType: 'decrease',
            period: 'Current',
            icon: '🏥',
            color: 'bg-purple-50 text-purple-600',
            details: '127/150 beds occupied',
            subDetails: 'ICU: 28/30, General: 99/120',
            trend: [
                { date: 'Mon', value: 88 },
                { date: 'Tue', value: 86 },
                { date: 'Wed', value: 87 },
                { date: 'Thu', value: 85 },
                { date: 'Fri', value: 85 }
            ]
        },
        {
            title: 'ER Wait Time',
            value: '32m',
            change: '-8m',
            changeType: 'decrease',
            period: 'Average',
            icon: '⏱️',
            color: 'bg-yellow-50 text-yellow-600',
            details: '12 patients waiting',
            subDetails: 'Critical: 2, Urgent: 5, Non-urgent: 5',
            trend: [
                { date: 'Mon', value: 40 },
                { date: 'Tue', value: 38 },
                { date: 'Wed', value: 35 },
                { date: 'Thu', value: 33 },
                { date: 'Fri', value: 32 }
            ]
        },
        {
            title: 'Staff Available',
            value: '42',
            change: '+3',
            changeType: 'increase',
            period: 'Current',
            icon: '👨‍⚕️',
            color: 'bg-red-50 text-red-600',
            details: '8 doctors, 34 nurses',
            subDetails: 'On Call: 12, Off Duty: 18',
            trend: [
                { date: 'Mon', value: 39 },
                { date: 'Tue', value: 40 },
                { date: 'Wed', value: 41 },
                { date: 'Thu', value: 41 },
                { date: 'Fri', value: 42 }
            ]
        },
        {
            title: 'Revenue',
            value: '$24.5K',
            change: '+15%',
            changeType: 'increase',
            period: 'Today',
            icon: '💰',
            color: 'bg-emerald-50 text-emerald-600',
            details: '$156K this week',
            subDetails: 'Insurance: $18.2K, Out-of-pocket: $6.3K',
            trend: [
                { date: 'Mon', value: 20.5 },
                { date: 'Tue', value: 21.8 },
                { date: 'Wed', value: 22.3 },
                { date: 'Thu', value: 23.7 },
                { date: 'Fri', value: 24.5 }
            ]
        }
    ];

    // Enhanced Quick Actions
    const quickActions = [
        {
            title: 'Update Profile',
            href: '/profile',
            icon: '👤',
            color: 'bg-blue-50 text-blue-600',
            description: 'Update your personal information and preferences'
        },
        {
            title: 'View Appointments',
            href: '/appointments',
            icon: '📅',
            color: 'bg-green-50 text-green-600',
            description: 'Manage your upcoming and past appointments'
        },
        {
            title: 'Medical Records',
            href: '/records',
            icon: '📋',
            color: 'bg-purple-50 text-purple-600',
            description: 'Access your complete medical history and test results'
        },
        {
            title: 'Messages',
            href: '/messages',
            icon: '✉️',
            color: 'bg-yellow-50 text-yellow-600',
            description: 'View and respond to messages from your healthcare team'
        },
        {
            title: 'Bio Information',
            href: '/bio',
            icon: '🧬',
            color: 'bg-red-50 text-red-600',
            description: 'Update your health information and conditions'
        },
        {
            title: 'Billing & Insurance',
            href: '/billing',
            icon: '💰',
            color: 'bg-emerald-50 text-emerald-600',
            description: 'View bills, insurance claims, and payment history'
        }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'profile_update':
                return '📝';
            case 'login':
                return '🔑';
            case 'logout':
                return '🚪';
            case 'appointment':
                return '📅';
            case 'message':
                return '✉️';
            case 'payment':
                return '💰';
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

    const handleAddJournalEntry = () => {
        const newEntry: HealthJournal = {
            id: healthJournal.length + 1,
            date: new Date().toISOString().split('T')[0],
            ...newJournalEntry
        } as HealthJournal;
        setHealthJournal([newEntry, ...healthJournal]);
        setShowJournalModal(false);
        setNewJournalEntry({
            mood: 'neutral',
            symptoms: [],
            notes: '',
            activities: []
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                    <p className="text-gray-600 mt-2">Here's your health overview for today</p>
                </div>

                {/* Notifications Bell */}
                <div className="relative mb-6">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"
                    >
                        <span className="relative">
                            🔔
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </span>
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                                <div className="space-y-3">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                                }`}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{notification.title}</h4>
                                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(notification.timestamp)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <span className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</span>
                                    <h3 className="ml-3 text-lg font-semibold text-gray-900">{stat.title}</h3>
                                </div>
                                <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-600">{stat.period}</p>
                            </div>
                            <div className="h-20">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stat.trend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={stat.color.split(' ')[1]}
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">{stat.details}</p>
                                <p className="text-xs text-gray-500">{stat.subDetails}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <span className={`p-3 rounded-lg ${action.color} text-2xl mb-2`}>
                                        {action.icon}
                                    </span>
                                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Health Metrics */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {healthMetrics.map((metric, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                                    <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' :
                                        metric.trend === 'down' ? 'text-red-600' :
                                            'text-gray-600'
                                        }`}>
                                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metric.value} <span className="text-lg text-gray-600">{metric.unit}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">Last updated: {metric.lastUpdated}</p>
                                </div>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metric.history}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medications */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Medications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {medications.map((medication) => (
                            <div key={medication.id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                                        <p className="text-sm text-gray-500 mt-2">Next dose: {medication.nextDose}</p>
                                        {medication.notes && (
                                            <p className="text-sm text-gray-600 mt-2">{medication.notes}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Remaining: {medication.remaining}</p>
                                        {medication.refillNeeded && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                Refill Needed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Journal */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Health Journal</h2>
                        <button
                            onClick={() => setShowJournalModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Entry
                        </button>
                    </div>
                    <div className="space-y-4">
                        {healthJournal.map((entry) => (
                            <div key={entry.id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{entry.date}</h3>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${entry.mood === 'great' ? 'bg-green-100 text-green-800' :
                                                    entry.mood === 'good' ? 'bg-blue-100 text-blue-800' :
                                                        entry.mood === 'neutral' ? 'bg-gray-100 text-gray-800' :
                                                            entry.mood === 'bad' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                }`}>
                                                {entry.mood}
                                            </span>
                                        </div>
                                        {entry.symptoms.length > 0 && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-600">Symptoms:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {entry.symptoms.map((symptom, index) => (
                                                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                            {symptom}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
                                        {entry.activities.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Activities:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {entry.activities.map((activity, index) => (
                                                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                            {activity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {emergencyContacts.map((contact) => (
                            <div key={contact.id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                                            {contact.isPrimary && (
                                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                                        <p className="text-sm text-gray-500 mt-2">{contact.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Call Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appointments and Health Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {appointment.date} at {appointment.time}
                                            </p>
                                            {appointment.notes && (
                                                <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Health Tips */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Tips</h2>
                        <div className="space-y-4">
                            {healthTips.map((tip) => (
                                <div key={tip.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900">{tip.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tip.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        tip.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {tip.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                                            <div className="flex items-center mt-2">
                                                <span className="text-xs text-gray-500">{tip.category}</span>
                                                {tip.actionRequired && (
                                                    <span className="ml-2 text-xs text-blue-600">Action Required</span>
                                                )}
                                            </div>
                                        </div>
                                        {!tip.read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Journal Entry Modal */}
            {showJournalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Journal Entry</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                                <select
                                    value={newJournalEntry.mood}
                                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, mood: e.target.value as any })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="great">Great</option>
                                    <option value="good">Good</option>
                                    <option value="neutral">Neutral</option>
                                    <option value="bad">Bad</option>
                                    <option value="terrible">Terrible</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                                <input
                                    type="text"
                                    placeholder="Enter symptoms (comma-separated)"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    onChange={(e) => setNewJournalEntry({
                                        ...newJournalEntry,
                                        symptoms: e.target.value.split(',').map(s => s.trim())
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows={3}
                                    placeholder="How are you feeling today?"
                                    value={newJournalEntry.notes}
                                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, notes: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
                                <input
                                    type="text"
                                    placeholder="Enter activities (comma-separated)"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    onChange={(e) => setNewJournalEntry({
                                        ...newJournalEntry,
                                        activities: e.target.value.split(',').map(s => s.trim())
                                    })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowJournalModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddJournalEntry}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Emergency Contact Modal */}
            {showEmergencyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
                        <div className="space-y-4">
                            {emergencyContacts.map((contact) => (
                                <div key={contact.id} className="border-b border-gray-100 pb-4 last:border-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{contact.name}</h3>
                                            <p className="text-sm text-gray-600">{contact.relationship}</p>
                                            <p className="text-sm text-gray-500">{contact.phone}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Call Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowEmergencyModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
