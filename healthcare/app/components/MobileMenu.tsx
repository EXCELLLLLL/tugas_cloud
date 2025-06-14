'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-800"
                aria-label="Toggle menu"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
                    <nav className="px-4 py-2">
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="#"
                                    className="block text-gray-600 hover:text-blue-800 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Care at Mayo Clinic
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="block text-gray-600 hover:text-blue-800 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Health Library
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="block text-gray-600 hover:text-blue-800 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Medical Professionals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="block text-gray-600 hover:text-blue-800 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Research & Education
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    )
} 