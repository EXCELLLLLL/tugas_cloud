"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(email, password)
            router.push('/dashboard')
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Login failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Main content wrapper */}
            <div className="flex flex-1 min-h-[80vh]">
                {/* Left: Login Box */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 mx-4 mt-12 mb-8 border border-gray-100">
                        <div className="flex flex-col items-center mb-6">
                            <Image src="/mayo-logo.svg" alt="Mayo Clinic" width={48} height={48} className="mb-2" />
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Welcome Back</h1>
                            <p className="text-lg font-semibold text-[#0a3fa8] text-center">Sign in to your account</p>
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                        autoComplete="current-password"
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#0a3fa8] focus:ring-[#0a3fa8] border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="font-medium text-[#0a3fa8] hover:underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0a3fa8] hover:bg-[#083080] text-white font-extrabold py-3 rounded-full text-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                        <div className="flex flex-col items-center mt-6">
                            <span className="text-base font-bold text-gray-900">Don't have an account?{' '}
                                <Link href="/register" className="text-[#0a3fa8] hover:underline">Create one</Link>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Right: Quick Access & App Badges */}
                <div className="hidden lg:flex flex-col justify-center bg-[#0a3fa8] text-white px-14 min-w-[370px] max-w-[420px] w-full">
                    <div>
                        <h2 className="text-2xl font-extrabold mb-8">Access Your Health Information</h2>
                        <ul className="space-y-6 mb-10">
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                View your medical records
                            </li>
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Manage appointments
                            </li>
                            <li className="flex items-center gap-3 font-bold text-lg">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded text-[#0a3fa8]">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none" /><path d="M9 12l2 2 4-4" stroke="#0a3fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                Check test results
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