'use client';

import React, { useState } from "react";
import MegaMenu from "./MegaMenu";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-md z-30">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
                {/* Logo */}
                <div className="flex flex-col items-center mr-4 md:mr-12 select-none" style={{ minWidth: 120 }}>
                    <span className="font-black text-xl leading-5 tracking-tight text-black text-center" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                    </span>
                    <span className="mt-1">
                        <Image src="/ciptahospitallogo.svg" alt="CiptaHospital" width={60} height={60} className="mb-2"/>
                    </span>
                </div>

                {/* Desktop Navigation with MegaMenu */}
                <div className="hidden md:block flex-1">
                    <MegaMenu />
                </div>

                {/* Right Section - Desktop */}
                <div className="hidden md:flex items-center gap-4 ml-12">
                    <span className="text-[16px] font-normal text-black">Request Appointment</span>
                    <Link href="/login" className="flex items-center gap-2 group">
                        {/* User icon */}
                        <svg width="22" height="22" fill="none" viewBox="0 0 22 22" className="text-black group-hover:text-[#1664b0] transition-colors"><circle cx="11" cy="7.5" r="3.5" stroke="#111" strokeWidth="1.5" /><path d="M3.5 18c0-2.485 3.134-4.5 7-4.5s7 2.015 7 4.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        <span className="text-[16px] font-normal text-black group-hover:text-[#1664b0] transition-colors">Log in</span>
                    </Link>
                    {/* Search icon */}
                    <button className="p-1" aria-label="Search">
                        <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><circle cx="10" cy="10" r="7" stroke="#111" strokeWidth="1.5" /><path d="M20 20l-4-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <button className="p-1" aria-label="Search">
                        <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><circle cx="10" cy="10" r="7" stroke="#111" strokeWidth="1.5" /><path d="M20 20l-4-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-3 space-y-1">
                        <Link href="/appointments" className="block py-2 text-[16px] font-normal text-black hover:text-[#1664b0]">
                            Request Appointment
                        </Link>
                        <Link href="/login" className="block py-2 text-[16px] font-normal text-black hover:text-[#1664b0]">
                            Log in
                        </Link>
                        {/* Mobile Navigation Items */}
                        <div className="pt-4 border-t border-gray-200">
                            <Link href="/patients-visitors" className="block py-2 text-[16px] font-normal text-black hover:text-[#1664b0]">
                                Patients & Visitors
                            </Link>
                            <Link href="/medical-professionals" className="block py-2 text-[16px] font-normal text-black hover:text-[#1664b0]">
                                Medical Professionals
                            </Link>
                            <Link href="/research" className="block py-2 text-[16px] font-normal text-black hover:text-[#1664b0]">
                                Research
                            </Link>
                            <Link href="/education" className="block py-2 text-[16px] font-normal text-black hover:text-[#1664b0]">
                                Education
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
} 