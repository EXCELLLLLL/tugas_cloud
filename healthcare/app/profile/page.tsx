"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

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

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Main content wrapper */}
            <div className="flex flex-1 min-h-[80vh]">
                {/* Left: Profile Box */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 mx-4 mt-12 mb-8 border border-gray-100">
                        <div className="flex flex-col items-center mb-6">
                            <Image src="/mayo-logo.svg" alt="Mayo Clinic" width={48} height={48} className="mb-2" />
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">My Profile</h1>
                            <p className="text-lg font-semibold text-[#0a3fa8] text-center">Manage your account</p>
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                                {success}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-base font-bold text-gray-900 mb-1">First Name</label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={!isEditing}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] disabled:bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-base font-bold text-gray-900 mb-1">Last Name</label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={!isEditing}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-base font-bold text-gray-900 mb-1">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!isEditing}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] disabled:bg-gray-50"
                                />
                            </div>
                            <div className="flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-[#0a3fa8] hover:bg-[#083080] text-white font-extrabold py-3 rounded-full text-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false)
                                                setFirstName(user.firstName)
                                                setLastName(user.lastName)
                                                setEmail(user.email)
                                            }}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold py-3 rounded-full text-xl transition-colors shadow-md"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="w-full bg-[#0a3fa8] hover:bg-[#083080] text-white font-extrabold py-3 rounded-full text-xl transition-colors shadow-md"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </form>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-extrabold py-3 rounded-full text-xl transition-colors shadow-md"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
                {/* Right: Account Information */}
                <div className="hidden lg:flex flex-col justify-center bg-[#0a3fa8] text-white px-14 min-w-[370px] max-w-[420px] w-full">
                    <div>
                        <h2 className="text-2xl font-extrabold mb-8">Account Information</h2>
                        <ul className="space-y-6 mb-10">
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Account Status: Active
                            </li>
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Member Since: {new Date().toLocaleDateString()}
                            </li>
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Role: {user.role}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="w-full border-t bg-gray-50 py-6 text-center text-xs text-gray-600 font-semibold">
                <div>
                    <Link href="#" className="hover:underline">LEGAL RESTRICTIONS AND TERMS OF USE APPLICABLE TO THIS SITE</Link>
                </div>
                <div className="mt-1">Use of this site signifies your agreement to the terms of use.</div>
                <div className="mt-1">© 1998 - 2025 Mayo Foundation for Medical Education and Research. All rights reserved.</div>
            </footer>
        </div>
    )
} 