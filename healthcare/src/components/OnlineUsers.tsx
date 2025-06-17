import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    lastActive: string;
}

export default function OnlineUsers() {
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8081/api/admin/users/online', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOnlineUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch online users');
                setLoading(false);
            }
        };

        fetchOnlineUsers();
        // Refresh every minute
        const interval = setInterval(fetchOnlineUsers, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Users</h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Users</h2>
                <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    const formatLastActive = (lastActive: string) => {
        const date = new Date(lastActive);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Users</h2>
            <div className="space-y-4">
                {onlineUsers.length > 0 ? (
                    onlineUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">
                                {formatLastActive(user.lastActive)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No users currently online</p>
                    </div>
                )}
            </div>
        </div>
    );
} 