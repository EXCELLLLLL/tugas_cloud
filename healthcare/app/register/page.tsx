"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await register(email, password, firstName, lastName)
            router.push('/dashboard')
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Registration failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Main content wrapper */}
            <div className="flex flex-1 min-h-[80vh]">
                {/* Left: Register Box */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 mx-4 mt-12 mb-8 border border-gray-100">
                        <div className="flex flex-col items-center mb-6">
                            <Image src="/mayo-logo.svg" alt="Mayo Clinic" width={48} height={48} className="mb-2" />
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Create Account</h1>
                            <p className="text-lg font-semibold text-[#0a3fa8] text-center">Join Mayo Clinic Patient Portal</p>
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
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
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
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
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-base font-bold text-gray-900 mb-1">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-base font-bold text-gray-900 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8] pr-20"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#0a3fa8] font-bold hover:underline"
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? 'HIDE' : 'SHOW'}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0a3fa8] hover:bg-[#083080] text-white font-extrabold py-3 rounded-full text-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                        <div className="flex flex-col items-center mt-6">
                            <span className="text-base font-bold text-gray-900">Already have an account?{' '}
                                <Link href="/login" className="text-[#0a3fa8] hover:underline">Log in</Link>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Right: Quick Access & App Badges */}
                <div className="hidden lg:flex flex-col justify-center bg-[#0a3fa8] text-white px-14 min-w-[370px] max-w-[420px] w-full">
                    <div>
                        <h2 className="text-2xl font-extrabold mb-8">Benefits of Creating an Account</h2>
                        <ul className="space-y-6 mb-10">
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Access your medical records
                            </li>
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Schedule appointments online
                            </li>
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                View test results
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