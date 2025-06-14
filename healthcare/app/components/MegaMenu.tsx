"use client"
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { menuData } from './menuData'

export default function MegaMenu() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const navRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenIndex(null)
            }
        }
        if (openIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openIndex])

    return (
        <nav ref={navRef} className="flex-1 flex items-end gap-4 lg:gap-10 relative">
            {menuData.map((menu, idx) => (
                <div
                    key={idx}
                    className="relative flex flex-col items-center min-w-[90px] lg:min-w-[110px]"
                >
                    <button
                        className={`flex flex-row items-center font-montserrat text-[14px] lg:text-[16px] font-normal text-center leading-tight whitespace-pre-line transition-colors pb-1
                            ${openIndex === idx ? 'text-[#1664b0] border-b-2 border-[#1664b0]' : 'text-black border-b-2 border-transparent'}
                        `}
                        style={{ outline: 'none' }}
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        aria-expanded={openIndex === idx}
                        aria-controls={`megamenu-dropdown-${idx}`}
                    >
                        <span className="max-w-[120px] lg:max-w-[140px] break-words">
                            {menu.label[0]}<br />{menu.label[1]}
                        </span>
                        <span className="ml-1 lg:ml-2 flex items-center">
                            <svg
                                width="16"
                                height="8"
                                viewBox="0 0 18 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform duration-200 ${openIndex === idx ? 'rotate-180 text-[#1664b0]' : 'text-black'}`}
                            >
                                <path d="M1 1.5L9 6.5L17 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>
                    {openIndex === idx && (
                        <div
                            id={`megamenu-dropdown-${idx}`}
                            className="fixed left-1/2 top-[88px] z-10 w-full max-w-screen-xl -translate-x-1/2 bg-white px-4 lg:px-12 py-6 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-24 rounded-b-2xl shadow-lg"
                        >
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
                                {menu.items.map((col, colIdx) => (
                                    <ul key={colIdx} className="space-y-4 lg:space-y-8">
                                        {col.map((item, itemIdx) => (
                                            <li key={itemIdx}>
                                                <Link
                                                    href={item.href}
                                                    className="text-[16px] lg:text-[20px] font-normal hover:underline"
                                                    onClick={() => setOpenIndex(null)}
                                                >
                                                    {item.text}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                            <div className="w-full lg:w-[420px] flex-shrink-0 lg:ml-16">
                                <Link
                                    href={menu.image.href}
                                    className="block relative rounded-xl overflow-hidden h-48 lg:h-72 shadow-lg"
                                    onClick={() => setOpenIndex(null)}
                                >
                                    <img
                                        src={menu.image.src}
                                        alt={menu.image.alt}
                                        className="object-cover w-full h-full"
                                    />
                                    <span className="absolute left-0 bottom-0 w-full p-4 lg:p-6 text-white text-xl lg:text-3xl font-bold bg-gradient-to-t from-black/70 to-transparent">
                                        {menu.image.caption} <span className="inline-block ml-2">&rarr;</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    )
} 