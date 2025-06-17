"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardHeader from '../components/DashboardHeader'

export default function ProfilePage() {
    const { user, isAuthenticated, logout, updateProfile } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        } else if (user) {
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setEmail(user.email)
        }
    }, [isAuthenticated, user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            await updateProfile({ firstName, lastName, email })
            setSuccess('Profile updated successfully')
            setIsEditing(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt="Profile"
                                            width={128}
                                            height={128}
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-[#0a3fa8] flex items-center justify-center text-white text-4xl font-bold">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                    )}
                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <span className="text-white text-sm font-medium">Change Photo</span>
                                        </label>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.firstName} {user.lastName}</h2>
                                <p className="text-gray-600 capitalize">{user.role}</p>
                                <div className="mt-4 w-full space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Member Since</span>
                                        <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Last Active</span>
                                        <span className="font-semibold">Just now</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Account Status</span>
                                        <span className="font-semibold text-green-600">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile'
                                            ? 'border-b-2 border-[#0a3fa8] text-[#0a3fa8]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Profile Information
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`px-6 py-4 text-sm font-medium ${activeTab === 'security'
                                            ? 'border-b-2 border-[#0a3fa8] text-[#0a3fa8]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Security
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('preferences')}
                                        className={`px-6 py-4 text-sm font-medium ${activeTab === 'preferences'
                                            ? 'border-b-2 border-[#0a3fa8] text-[#0a3fa8]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Preferences
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'profile' && (
                                    <div>
                                        {error && (
                                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                                {error}
                                            </div>
                                        )}
                                        {success && (
                                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                                                {success}
                                            </div>
                                        )}
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                        First Name
                                                    </label>
                                                    <input
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        required
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        disabled={!isEditing}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] disabled:bg-gray-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        required
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        disabled={!isEditing}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] disabled:bg-gray-50"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={!isEditing}
                                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-4">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsEditing(false)
                                                                setFirstName(user.firstName)
                                                                setLastName(user.lastName)
                                                                setEmail(user.email)
                                                            }}
                                                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isLoading}
                                                            className="px-6 py-2.5 bg-[#0a3fa8] text-white rounded-lg font-medium hover:bg-[#083080] disabled:opacity-50"
                                                        >
                                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditing(true)}
                                                        className="px-6 py-2.5 bg-[#0a3fa8] text-white rounded-lg font-medium hover:bg-[#083080]"
                                                    >
                                                        Edit Profile
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <h3 className="text-lg font-medium text-yellow-800 mb-2">Security Settings</h3>
                                            <p className="text-yellow-700">Security settings will be available soon.</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preferences' && (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h3 className="text-lg font-medium text-blue-800 mb-2">Preferences</h3>
                                            <p className="text-blue-700">User preferences will be available soon.</p>
                                        </div>
                                    </div>
                                )}
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
    )
} 