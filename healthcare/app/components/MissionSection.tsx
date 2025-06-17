"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Custom hook for animated counters
function useAnimatedCounter(target: number, start: number = 0, duration: number = 1.5) {
    const [count, setCount] = useState(start);
    useEffect(() => {
        const obj = { val: start };
        gsap.to(obj, {
            val: target,
            duration,
            ease: 'power1.out',
            onUpdate: () => setCount(Math.floor(obj.val)),
        });
    }, [target, duration]);
    return count;
}

export default function MissionSection() {
    const missionStatsRef = useRef(null);
    const cardRefs = useRef([]);
    const timelineRefs = useRef([]);
    const [statsInView, setStatsInView] = useState(false);

    // Animated counters
    const patients = useAnimatedCounter(statsInView ? 1000000 : 0);
    const uptime = useAnimatedCounter(statsInView ? 99.9 : 0);
    const hospitals = useAnimatedCounter(statsInView ? 50 : 0);
    const support = useAnimatedCounter(statsInView ? 24 : 0);

    useEffect(() => {
        if (!missionStatsRef.current) return;

        // Stats animation
        ScrollTrigger.create({
            trigger: missionStatsRef.current,
            start: 'top 80%',
            onEnter: () => setStatsInView(true),
        });

        // Card animations
        cardRefs.current.forEach((ref, i) => {
            if (ref) {
                gsap.fromTo(
                    ref,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        delay: i * 0.2,
                        scrollTrigger: {
                            trigger: ref,
                            start: 'top 85%',
                        },
                    }
                );
            }
        });

        // Timeline animations
        timelineRefs.current.forEach((ref, i) => {
            if (ref) {
                gsap.fromTo(
                    ref,
                    { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.7,
                        delay: i * 0.2,
                        scrollTrigger: {
                            trigger: ref,
                            start: 'top 85%',
                        },
                    }
                );
            }
        });
    }, []);

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        To transform healthcare through technology and compassionate care, making quality healthcare accessible to everyone.
                    </p>
                </div>

                {/* Mission Stats */}
                <div ref={missionStatsRef} className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{support}/7</div>
                        <div className="text-gray-600">Patient Support</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{uptime}%</div>
                        <div className="text-gray-600">System Uptime</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-4xl font-bold text-blue-600 mb-2">+{hospitals}</div>
                        <div className="text-gray-600">Hospitals</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{patients.toLocaleString()}+</div>
                        <div className="text-gray-600">Patients Served</div>
                    </div>
                </div>

                {/* Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            title: "Improve Care",
                            description: "Enhancing patient outcomes through innovative technology",
                            features: ["Real-time monitoring", "AI-powered diagnostics", "Personalized care plans"]
                        },
                        {
                            title: "Increase Efficiency",
                            description: "Streamlining healthcare processes for better service",
                            features: ["Automated workflows", "Smart scheduling", "Resource optimization"]
                        },
                        {
                            title: "Ensure Security",
                            description: "Protecting patient data with advanced security measures",
                            features: ["HIPAA compliance", "End-to-end encryption", "Regular audits"]
                        }
                    ].map((card, index) => (
                        <div
                            key={card.title}
                            ref={el => cardRefs.current[index] = el}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                            <p className="text-gray-600 mb-6">{card.description}</p>
                            <ul className="space-y-2">
                                {card.features.map(feature => (
                                    <li key={feature} className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Mission Timeline */}
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-8">Our Journey</h3>
                    <div className="space-y-8">
                        {[
                            { year: "2020", title: "Founded", description: "Started with a vision to transform healthcare" },
                            { year: "2021", title: "Expansion", description: "Launched services in 10 major cities" },
                            { year: "2022", title: "Innovation", description: "Introduced AI-powered diagnostics" },
                            { year: "2023", title: "Growth", description: "Reached 1 million patients served" }
                        ].map((event, index) => (
                            <div
                                key={event.year}
                                ref={el => timelineRefs.current[index] = el}
                                className="flex items-center space-x-4"
                            >
                                <div className="flex-shrink-0 w-24 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{event.year}</div>
                                </div>
                                <div className="flex-grow bg-white p-6 rounded-xl shadow-lg">
                                    <h4 className="text-xl font-bold mb-2">{event.title}</h4>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
} 