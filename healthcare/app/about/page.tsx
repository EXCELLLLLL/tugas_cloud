"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from 'next-themes';
import Image from 'next/image';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    image: string;
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
    expertise: string[];
    achievements?: string[];
    education?: string[];
    certifications?: string[];
}

interface TechCategory {
    id: string;
    name: string;
    description: string;
    color: string;
}

interface TechUsage {
    technology: string;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
}

interface Value {
    title: string;
    description: string;
    icon: string;
    color: string;
}

interface Impact {
    metric: string;
    value: string;
    description: string;
    trend: 'up' | 'down' | 'stable';
    change: string;
}

interface Partner {
    name: string;
    logo: string;
    type: string;
    description: string;
    website: string;
}

interface Milestone {
    year: string;
    title: string;
    description: string;
    icon: string;
}

interface Achievement {
    title: string;
    value: string;
    description: string;
    icon: string;
}

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    organization: string;
    image: string;
}

interface NewsItem {
    title: string;
    date: string;
    category: string;
    description: string;
    image: string;
    link: string;
}

interface Technology {
    name: string;
    description: string;
    icon: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI' | 'Cloud' | 'Security' | 'Analytics' | 'Mobile' | 'IoT' | 'Blockchain';
    features?: string[];
    benefits?: string[];
}

const teamMembers: TeamMember[] = [
    {
        name: "Dr. Sarah Johnson",
        role: "Chief Medical Officer",
        bio: "Leading medical innovation and clinical excellence",
        image: "/yohanes.jpeg",
        expertise: ["Clinical Research", "Medical Innovation", "Healthcare Policy"],
        education: [
            "MD, Harvard Medical School",
            "MPH, Johns Hopkins University",
            "Residency at Massachusetts General Hospital"
        ],
        certifications: [
            "Board Certified in Internal Medicine",
            "Healthcare Innovation Certification",
            "Advanced Cardiac Life Support (ACLS)",
            "Medical Quality Improvement Certification"
        ],
        achievements: [
            "Published 50+ research papers in leading medical journals",
            "Led 20+ clinical trials for innovative treatments",
            "Developed new treatment protocols adopted by 100+ hospitals",
            "Reduced patient readmission rates by 40%"
        ],
        social: {
            linkedin: "https://linkedin.com/in/sarahjohnson",
            twitter: "https://twitter.com/sarahjohnson"
        }
    },
    {
        name: "Michael Chen",
        role: "Chief Technology Officer",
        bio: "Driving technological innovation in healthcare",
        image: "/yohanes.jpeg",
        expertise: ["Healthcare Technology", "AI/ML", "System Architecture"],
        education: [
            "MS in Computer Science, Stanford University",
            "BS in Electrical Engineering, MIT",
            "Executive Leadership Program, Wharton School"
        ],
        certifications: [
            "AWS Solutions Architect Professional",
            "Google Cloud Professional Architect",
            "Certified Information Systems Security Professional (CISSP)",
            "Project Management Professional (PMP)"
        ],
        achievements: [
            "Architected scalable healthcare platform serving 1M+ patients",
            "Implemented AI solutions reducing diagnosis time by 60%",
            "Led digital transformation saving $50M annually",
            "Developed proprietary healthcare algorithms"
        ],
        social: {
            linkedin: "https://linkedin.com/in/michaelchen",
            github: "https://github.com/michaelchen"
        }
    },
    {
        name: "Dr. Emily Rodriguez",
        role: "Head of Research",
        bio: "Pioneering healthcare research and innovation",
        image: "/team/placeholder-3.jpg",
        expertise: ["Medical Research", "Clinical Trials", "Data Analysis"],
        education: [
            "PhD in Biomedical Sciences, Stanford University",
            "MD, University of California, San Francisco",
            "Postdoctoral Fellowship at NIH"
        ],
        certifications: [
            "Clinical Research Professional Certification",
            "Good Clinical Practice (GCP) Certification",
            "Human Subjects Research Certification",
            "Biostatistics Certification"
        ],
        achievements: [
            "Secured $25M in research grants",
            "Published 75+ peer-reviewed papers",
            "Developed breakthrough treatment protocols",
            "Led international research collaborations"
        ],
        social: {
            linkedin: "https://linkedin.com/in/emilyrodriguez",
            twitter: "https://twitter.com/emilyrodriguez"
        }
    },
    {
        name: "Dr. David Kim",
        role: "Chief Medical Officer",
        bio: "Leading medical innovation and clinical excellence",
        image: "/team/placeholder-4.jpg",
        expertise: ["Clinical Research", "Medical Innovation", "Healthcare Policy"],
        education: [
            "MD, Johns Hopkins University",
            "MPH, Harvard University",
            "Fellowship at Mayo Clinic"
        ],
        certifications: [
            "Board Certified in Internal Medicine",
            "Healthcare Innovation Certification",
            "Advanced Cardiac Life Support (ACLS)",
            "Medical Quality Improvement Certification"
        ],
        achievements: [
            "Published 40+ research papers in leading medical journals",
            "Led 15+ clinical trials for innovative treatments",
            "Developed new treatment protocols adopted by 80+ hospitals",
            "Reduced patient readmission rates by 35%"
        ],
        social: {
            linkedin: "https://linkedin.com/in/davidkim",
            twitter: "https://twitter.com/davidkim"
        }
    },
    {
        name: "Lisa Chen",
        role: "Head of Product",
        bio: "Driving product strategy and user experience",
        image: "/team/lisa-chen.jpg",
        expertise: ["Product Strategy", "UX Design", "Healthcare Technology"],
        education: [
            "MS in Computer Science, Stanford",
            "MBA, Wharton School",
            "BS in Human-Computer Interaction, Carnegie Mellon"
        ],
        certifications: [
            "Product Management Professional",
            "UX Design Certification",
            "Agile Certified Product Manager",
            "Healthcare IT Certification"
        ],
        achievements: [
            "Launched 10+ successful products",
            "Increased user engagement by 200%",
            "Reduced patient wait times by 40%",
            "Led digital transformation initiatives"
        ],
        social: {
            linkedin: "https://linkedin.com/in/lisachen",
            github: "https://github.com/lisachen"
        }
    },
    {
        name: "James Wilson",
        role: "Head of Security",
        bio: "Ensuring data security and compliance",
        image: "/team/james-wilson.jpg",
        expertise: ["Cybersecurity", "HIPAA Compliance", "Risk Management"],
        education: [
            "MS in Cybersecurity, MIT",
            "BS in Computer Science, Georgia Tech",
            "Executive Leadership Program, Harvard Business School"
        ],
        certifications: [
            "Certified Information Systems Security Professional (CISSP)",
            "Certified Ethical Hacker (CEH)",
            "Certified Information Security Manager (CISM)",
            "HIPAA Security Professional"
        ],
        achievements: [
            "Implemented zero-trust security model",
            "Reduced security incidents by 90%",
            "Achieved SOC 2 Type II certification",
            "Developed comprehensive security protocols"
        ],
        social: {
            linkedin: "https://linkedin.com/in/jameswilson",
            twitter: "https://twitter.com/jameswilson"
        }
    },
    {
        name: "Alexandra Martinez",
        role: "Chief Marketing Officer",
        bio: "Driving healthcare innovation through strategic marketing",
        image: "/team/alexandra-martinez.jpg",
        expertise: ["Healthcare Marketing", "Digital Strategy", "Brand Development"],
        education: [
            "MBA in Marketing, Columbia Business School",
            "BS in Communications, New York University",
            "Digital Marketing Certification, MIT"
        ],
        certifications: [
            "Certified Digital Marketing Professional",
            "Healthcare Marketing Specialist",
            "Brand Strategy Certification",
            "Social Media Marketing Expert"
        ],
        achievements: [
            "Increased brand awareness by 300%",
            "Launched successful digital campaigns reaching 5M+ users",
            "Developed award-winning healthcare marketing strategies",
            "Led rebranding initiative resulting in 200% growth"
        ],
        social: {
            linkedin: "https://linkedin.com/in/alexandramartinez",
            twitter: "https://twitter.com/alexandramartinez"
        }
    },
    {
        name: "Robert Thompson",
        role: "Head of Operations",
        bio: "Optimizing healthcare delivery and operational excellence",
        image: "/team/robert-thompson.jpg",
        expertise: ["Healthcare Operations", "Process Optimization", "Quality Management"],
        education: [
            "MS in Healthcare Management, Johns Hopkins University",
            "BS in Industrial Engineering, Georgia Tech",
            "Executive Leadership Program, Harvard Business School"
        ],
        certifications: [
            "Lean Six Sigma Black Belt",
            "Healthcare Operations Management",
            "Project Management Professional (PMP)",
            "Quality Management Certification"
        ],
        achievements: [
            "Reduced operational costs by 40%",
            "Improved patient flow efficiency by 60%",
            "Implemented quality management system across 50+ facilities",
            "Led digital transformation reducing wait times by 70%"
        ],
        social: {
            linkedin: "https://linkedin.com/in/robertthompson",
            twitter: "https://twitter.com/robertthompson"
        }
    }
];

const technologies: Technology[] = [
    {
        name: "Next.js Frontend",
        description: "Modern React framework for healthcare applications",
        icon: "⚛️",
        category: "Frontend",
        features: [
            "Server-side rendering",
            "TypeScript support",
            "API routes",
            "Built-in optimization"
        ],
        benefits: [
            "Fast page loads",
            "SEO friendly",
            "Great developer experience",
            "Scalable architecture"
        ]
    },
    {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        icon: "🎨",
        category: "Frontend",
        features: [
            "Responsive design",
            "Custom components",
            "Dark mode support",
            "Performance optimized"
        ],
        benefits: [
            "Rapid development",
            "Consistent design",
            "Small bundle size",
            "Easy maintenance"
        ]
    },
    {
        name: "Go Backend Services",
        description: "High-performance microservices",
        icon: "🚀",
        category: "Backend",
        features: [
            "Concurrent processing",
            "Low latency",
            "Memory efficient",
            "Built-in testing"
        ],
        benefits: [
            "High throughput",
            "Low resource usage",
            "Easy deployment",
            "Strong typing"
        ]
    },
    {
        name: "PostgreSQL",
        description: "Advanced open-source database",
        icon: "🗄️",
        category: "Database",
        features: [
            "ACID compliance",
            "JSON support",
            "Full-text search",
            "Spatial data"
        ],
        benefits: [
            "Data integrity",
            "Scalability",
            "Complex queries",
            "Reliable backup"
        ]
    },
    {
        name: "Redis Cache",
        description: "In-memory data structure store",
        icon: "⚡",
        category: "Database",
        features: [
            "Key-value store",
            "Pub/Sub messaging",
            "Data persistence",
            "Atomic operations"
        ],
        benefits: [
            "Ultra-fast access",
            "Reduced latency",
            "Session management",
            "Real-time features"
        ]
    },
    {
        name: "Docker & Kubernetes",
        description: "Container orchestration platform",
        icon: "🐳",
        category: "DevOps",
        features: [
            "Containerization",
            "Auto-scaling",
            "Load balancing",
            "Service discovery"
        ],
        benefits: [
            "Consistent environments",
            "Easy scaling",
            "High availability",
            "Resource efficiency"
        ]
    },
    {
        name: "GitHub Actions",
        description: "CI/CD automation platform",
        icon: "🔄",
        category: "DevOps",
        features: [
            "Automated testing",
            "Deployment pipelines",
            "Code quality checks",
            "Security scanning"
        ],
        benefits: [
            "Faster releases",
            "Quality assurance",
            "Automated workflows",
            "Team collaboration"
        ]
    }
];

const techCategories: TechCategory[] = [
    { id: 'all', name: 'All Technologies', description: 'Complete technology stack', color: 'blue' },
    { id: 'frontend', name: 'Frontend', description: 'User interface technologies', color: 'purple' },
    { id: 'backend', name: 'Backend', description: 'Server-side technologies', color: 'green' },
    { id: 'database', name: 'Database', description: 'Data storage solutions', color: 'yellow' },
    { id: 'devops', name: 'DevOps', description: 'Infrastructure and deployment', color: 'red' },
    { id: 'ai', name: 'AI/ML', description: 'Artificial intelligence and machine learning', color: 'pink' }
];

const techUsage: TechUsage[] = [
    { technology: 'Next.js', percentage: 95, trend: 'up' },
    { technology: 'Go', percentage: 90, trend: 'up' },
    { technology: 'PostgreSQL', percentage: 85, trend: 'stable' },
    { technology: 'Docker', percentage: 88, trend: 'up' },
    { technology: 'Kubernetes', percentage: 82, trend: 'up' },
    { technology: 'TensorFlow', percentage: 75, trend: 'up' }
];

const values: Value[] = [
    {
        title: "Patient-Centered Care",
        description: "Putting patients first in every decision and innovation",
        icon: "❤️",
        color: "red"
    },
    {
        title: "Innovation",
        description: "Continuously pushing boundaries in healthcare technology",
        icon: "💡",
        color: "blue"
    },
    {
        title: "Excellence",
        description: "Maintaining the highest standards in healthcare delivery",
        icon: "⭐",
        color: "yellow"
    },
    {
        title: "Collaboration",
        description: "Working together to achieve better health outcomes",
        icon: "🤝",
        color: "green"
    },
    {
        title: "Integrity",
        description: "Upholding ethical standards and transparency",
        icon: "🔒",
        color: "purple"
    },
    {
        title: "Accessibility",
        description: "Making healthcare available to everyone",
        icon: "🌍",
        color: "indigo"
    }
];

const impacts: Impact[] = [
    {
        metric: "Patient Satisfaction",
        value: "98%",
        description: "Overall patient satisfaction rate",
        trend: "up",
        change: "+5% from last year"
    },
    {
        metric: "Healthcare Access",
        value: "2.5M",
        description: "Patients served globally",
        trend: "up",
        change: "+500K this year"
    },
    {
        metric: "Cost Reduction",
        value: "30%",
        description: "Average reduction in healthcare costs",
        trend: "up",
        change: "+8% efficiency"
    },
    {
        metric: "Response Time",
        value: "< 2min",
        description: "Average response time",
        trend: "up",
        change: "-45s improvement"
    }
];

const partners: Partner[] = [
    {
        name: "Mayo Clinic",
        logo: "/partners/mayo.png",
        type: "Healthcare Provider",
        description: "Leading medical research and patient care",
        website: "https://www.mayoclinic.org"
    },
    {
        name: "Google Health",
        logo: "/partners/google.png",
        type: "Technology Partner",
        description: "AI and machine learning solutions",
        website: "https://health.google"
    },
    {
        name: "Pfizer",
        logo: "/partners/pfizer.png",
        type: "Pharmaceutical",
        description: "Research and development collaboration",
        website: "https://www.pfizer.com"
    },
    {
        name: "Microsoft Healthcare",
        logo: "/partners/microsoft.png",
        type: "Technology Partner",
        description: "Cloud and AI solutions",
        website: "https://www.microsoft.com/healthcare"
    }
];

const milestones: Milestone[] = [
    {
        year: "2020",
        title: "Foundation",
        description: "Established with a vision to transform healthcare through technology",
        icon: "🏥"
    },
    {
        year: "2021",
        title: "First Major Partnership",
        description: "Partnered with leading healthcare providers to expand our reach",
        icon: "🤝"
    },
    {
        year: "2022",
        title: "AI Integration",
        description: "Launched AI-powered diagnostic tools and predictive analytics",
        icon: "🤖"
    },
    {
        year: "2023",
        title: "Global Expansion",
        description: "Expanded operations to 25+ countries worldwide",
        icon: "🌍"
    }
];

const achievements: Achievement[] = [
    {
        title: "Patient Satisfaction",
        value: "98%",
        description: "Overall patient satisfaction rate",
        icon: "😊"
    },
    {
        title: "Healthcare Providers",
        value: "500+",
        description: "Partner healthcare institutions",
        icon: "👨‍⚕️"
    },
    {
        title: "Countries Served",
        value: "25+",
        description: "Global presence",
        icon: "🌎"
    },
    {
        title: "Research Papers",
        value: "100+",
        description: "Published in leading journals",
        icon: "📚"
    }
];

const testimonials: Testimonial[] = [
    {
        quote: "This platform has revolutionized how we deliver healthcare services. The integration of AI and real-time monitoring has significantly improved patient outcomes.",
        author: "Dr. Emily Chen",
        role: "Medical Director",
        organization: "City General Hospital",
        image: "/testimonials/emily.jpg"
    },
    {
        quote: "The seamless integration of various healthcare services has made our operations more efficient and patient-centric than ever before.",
        author: "Sarah Thompson",
        role: "Healthcare Administrator",
        organization: "Regional Medical Center",
        image: "/testimonials/sarah.jpg"
    },
    {
        quote: "The innovative approach to healthcare technology has set new standards in the industry. It's truly transformative.",
        author: "Dr. Michael Rodriguez",
        role: "Chief of Medicine",
        organization: "University Hospital",
        image: "/testimonials/michael.jpg"
    }
];

const newsItems: NewsItem[] = [
    {
        title: "New AI-Powered Diagnostic Tool Launched",
        date: "2024-03-15",
        category: "Innovation",
        description: "Introducing our latest AI diagnostic tool that improves accuracy by 40%",
        image: "/news/ai-diagnostic.jpg",
        link: "/news/ai-diagnostic"
    },
    {
        title: "Global Healthcare Partnership Announced",
        date: "2024-03-10",
        category: "Partnership",
        description: "Expanding our reach to 10 new countries through strategic partnerships",
        image: "/news/partnership.jpg",
        link: "/news/global-partnership"
    },
    {
        title: "Healthcare Excellence Award 2024",
        date: "2024-03-05",
        category: "Awards",
        description: "Recognized for outstanding contribution to healthcare innovation",
        image: "/news/award.jpg",
        link: "/news/excellence-award"
    }
];

function SpinningCube() {
    return (
        <mesh rotation={[0.4, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
        </mesh>
    );
}

function TechCard({ tech, isSelected, onClick }: { tech: typeof technologies[0], isSelected: boolean, onClick: () => void }) {
    return (
        <div
            className={`relative group cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105' : 'hover:scale-105'
                }`}
            onClick={onClick}
        >
            <div className={`p-6 rounded-xl bg-white shadow-lg border-2 ${isSelected ? 'border-blue-500' : 'border-gray-100'
                } hover:border-blue-500 transition-colors duration-300`}>
                <div className="flex items-center space-x-4">
                    <span className="text-4xl">{tech.icon}</span>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                        <p className="text-sm text-gray-500">{tech.category}</p>
                    </div>
                </div>
                <div className={`mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform origin-left transition-transform duration-300 ${isSelected ? 'scale-x-100' : 'scale-x-0'
                    }`} />
            </div>
        </div>
    );
}

function TechUsageBar({ usage }: { usage: TechUsage }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{usage.technology}</span>
                <span className="text-sm font-medium text-gray-500">{usage.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${usage.percentage}%` }}
                />
            </div>
        </div>
    );
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

function ValueCard({ value, index }: { value: Value, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 80%"
                    }
                }
            );
        }
    }, [index]);

    return (
        <div
            ref={cardRef}
            className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-${value.color}-50 to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10">
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
            </div>
        </div>
    );
}

function ImpactCard({ impact }: { impact: Impact }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{impact.metric}</h3>
                <span className={`text-2xl font-bold ${impact.trend === 'up' ? 'text-green-500' :
                    impact.trend === 'down' ? 'text-red-500' :
                        'text-blue-500'
                    }`}>
                    {impact.value}
                </span>
            </div>
            <p className="text-gray-600 mb-2">{impact.description}</p>
            <div className="flex items-center text-sm text-gray-500">
                <span className={`mr-2 ${impact.trend === 'up' ? 'text-green-500' :
                    impact.trend === 'down' ? 'text-red-500' :
                        'text-blue-500'
                    }`}>
                    {impact.change}
                </span>
            </div>
        </div>
    );
}

function PartnerCard({ partner }: { partner: Partner }) {
    return (
        <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 relative">
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-500">{partner.type}</p>
                </div>
            </div>
            <p className="text-gray-600 mb-4">{partner.description}</p>
            <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300"
            >
                Visit Website
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        </div>
    );
}

function MilestoneCard({ milestone, index }: { milestone: Milestone, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 80%"
                    }
                }
            );
        }
    }, [index]);

    return (
        <div
            ref={cardRef}
            className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {milestone.icon}
            </div>
            <div className="ml-4">
                <span className="text-sm font-semibold text-blue-500">{milestone.year}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{milestone.title}</h3>
                <p className="text-gray-600 mt-2">{milestone.description}</p>
            </div>
        </div>
    );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center space-x-4">
                <span className="text-4xl">{achievement.icon}</span>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{achievement.value}</h3>
                    <p className="text-gray-600">{achievement.title}</p>
                </div>
            </div>
            <p className="text-gray-500 mt-4">{achievement.description}</p>
        </div>
    );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 80%"
                    }
                }
            );
        }
    }, [index]);

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.organization}</p>
                </div>
            </div>
            <blockquote className="text-gray-700 italic">"{testimonial.quote}"</blockquote>
        </div>
    );
}

function NewsCard({ news }: { news: NewsItem }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-48">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        {news.category}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{news.date}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.description}</p>
                <a
                    href={news.link}
                    className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center"
                >
                    Read More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top bottom-=100",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }, []);

    const handleExpand = () => {
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                height: isExpanded ? 0 : "auto",
                duration: 0.5,
                ease: "power2.inOut"
            });
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
            <div className="relative group">
                <div className="relative h-[400px] w-full overflow-hidden">
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-[-10px] transition-transform duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center">{member.name}</h3>
                        <p className="text-lg font-medium text-blue-600 text-center">{member.role}</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <p className="text-gray-600 mb-4 text-center">{member.bio}</p>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">Expertise</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {member.expertise.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleExpand}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        {isExpanded ? "Show Less" : "Show More"}
                        <svg
                            className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div
                        ref={contentRef}
                        className="overflow-hidden"
                        style={{ height: 0 }}
                    >
                        <div className="space-y-4 pt-4">
                            {member.education && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">Education</h4>
                                    <ul className="space-y-2">
                                        {member.education.map((edu, index) => (
                                            <li key={index} className="text-gray-600 flex items-start gap-2">
                                                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                {edu}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {member.certifications && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">Certifications</h4>
                                    <ul className="space-y-2">
                                        {member.certifications.map((cert, index) => (
                                            <li key={index} className="text-gray-600 flex items-start gap-2">
                                                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                                {cert}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {member.achievements && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">Key Achievements</h4>
                                    <ul className="space-y-2">
                                        {member.achievements.map((achievement, index) => (
                                            <li key={index} className="text-gray-600 flex items-start gap-2">
                                                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {member.social && (
                        <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
                            {member.social.linkedin && (
                                <a
                                    href={member.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            )}
                            {member.social.twitter && (
                                <a
                                    href={member.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-400 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                            )}
                            {member.social.github && (
                                <a
                                    href={member.social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function TechnologyCard({ tech }: { tech: Technology }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 80%"
                    }
                }
            );
        }
    }, []);

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
            <div className="text-4xl mb-4">{tech.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
            <p className="text-gray-600 mb-4">{tech.description}</p>

            {/* Features */}
            {tech.features && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        {tech.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Benefits */}
            {tech.benefits && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        {tech.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {tech.category}
            </span>
        </div>
    );
}

export default function AboutPage() {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('mission');
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);
    const [selectedTech, setSelectedTech] = useState<string | null>(null);
    const [showStats, setShowStats] = useState(false);
    const [statsInView, setStatsInView] = useState(false);
    const [patients, setPatients] = useState(0);
    const [uptime, setUptime] = useState(0);
    const [hospitals, setHospitals] = useState(0);
    const [support, setSupport] = useState(0);

    // Refs for GSAP animations
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const missionStatsRef = useRef<HTMLDivElement>(null);
    const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const missionRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const techRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate stats when they come into view
        if (statsRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateStats();
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(statsRef.current);
            return () => observer.disconnect();
        }
    }, []);

    const animateStats = () => {
        gsap.to({ value: patients }, {
            duration: 2,
            value: 1000000,
            snap: { value: 1 },
            onUpdate: () => setPatients(Math.floor(patients)),
            ease: "power2.out"
        });

        gsap.to({ value: uptime }, {
            duration: 2,
            value: 99.9,
            snap: { value: 0.1 },
            onUpdate: () => setUptime(uptime),
            ease: "power2.out"
        });

        gsap.to({ value: hospitals }, {
            duration: 2,
            value: 500,
            snap: { value: 1 },
            onUpdate: () => setHospitals(Math.floor(hospitals)),
            ease: "power2.out"
        });

        gsap.to({ value: support }, {
            duration: 2,
            value: 24,
            snap: { value: 1 },
            onUpdate: () => setSupport(Math.floor(support)),
            ease: "power2.out"
        });
    };

    // GSAP Animations
    useEffect(() => {
        // Hero section animation
        gsap.fromTo(
            heroRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
            }
        );

        // Title animation
        gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out'
            }
        );

        // Description animation
        gsap.fromTo(
            descriptionRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.6,
                ease: 'power3.out'
            }
        );

        // Tabs animation
        gsap.fromTo(
            tabsRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.9,
                ease: 'power3.out'
            }
        );

        // Content sections animation
        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Stats animation
        if (showStats) {
            gsap.fromTo(
                statsRef.current,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                }
            );
        }
    }, [showStats]);

    // Animate statistics when shown
    useEffect(() => {
        if (showStats) {
            const duration = 2000;
            const steps = 50;
            const interval = duration / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setStats({
                    patients: Math.floor(10000 * progress),
                    doctors: Math.floor(500 * progress),
                    hospitals: Math.floor(100 * progress),
                    countries: Math.floor(25 * progress)
                });

                if (currentStep === steps) {
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [showStats]);

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero Section with GSAP Animation */}
                <div ref={heroRef} className="relative h-[60vh] bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="absolute inset-0">
                        <Canvas>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[2, 1, 1]} />
                            <Sphere args={[1, 100, 200]} scale={2}>
                                <MeshDistortMaterial
                                    color="#1e40af"
                                    attach="material"
                                    distort={0.5}
                                    speed={1.5}
                                    roughness={0}
                                />
                            </Sphere>
                            <OrbitControls enableZoom={false} autoRotate />
                        </Canvas>
                    </div>
                    <div className="relative z-10 flex items-center justify-center h-full text-white">
                        <div className="text-center">
                            <h1 ref={titleRef} className="text-5xl font-bold mb-4">About Us</h1>
                            <p ref={descriptionRef} className="text-xl">Transforming Healthcare Through Technology</p>
                        </div>
                    </div>
                </div>

                {/* Main Content with GSAP Animation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div ref={contentRef} className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                        {/* Tabs with GSAP Animation */}
                        <div ref={tabsRef} className="flex flex-wrap justify-center gap-4 mb-8">
                            {['mission', 'team', 'tech', 'values', 'impact', 'partners'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                                        ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-md transform scale-105'
                                        : 'text-[#1e40af] hover:bg-[#f1f5f9]'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Mission Section with Enhanced Cards */}
                        {activeTab === 'mission' && (
                            <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in relative overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-blue-100 to-blue-50">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="text-center mb-12">
                                        <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Our Mission</h2>
                                        <p className="text-xl text-[#334155] max-w-3xl mx-auto">
                                            To transform healthcare through technology and compassionate care, making quality healthcare accessible to everyone.
                                        </p>
                                    </div>

                                    {/* Mission Stats with Animated Counters */}
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

                                    {/* Main Mission Cards with Reveal Animation */}
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

                                    {/* Mission Timeline with Reveal Animation */}
                                    <div className="mt-12 max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-8">Our Journey</h3>
                                        <div className="space-y-8">
                                            {milestones.map((milestone, index) => (
                                                <MilestoneCard key={milestone.year} milestone={milestone} index={index} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Call to Action */}
                                    <div className="mt-12 text-center">
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                                        >
                                            <span className="mr-2">Join Our Mission</span>
                                            <svg
                                                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Team Section with Enhanced Interactive Cards */}
                        {activeTab === 'team' && (
                            <div className="space-y-8">
                                <div className="flex flex-wrap justify-center gap-4 mb-8">
                                    <button
                                        onClick={() => setSelectedTech(null)}
                                        className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedTech === null
                                            ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white'
                                            : 'bg-white text-[#1e40af] hover:bg-[#f1f5f9]'
                                            }`}
                                    >
                                        All Teams
                                    </button>
                                    {Array.from(new Set(teamMembers.flatMap(member => member.expertise))).map((expertise) => (
                                        <button
                                            key={expertise}
                                            onClick={() => setSelectedTech(expertise)}
                                            className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedTech === expertise
                                                ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white'
                                                : 'bg-white text-[#1e40af] hover:bg-[#f1f5f9]'
                                                }`}
                                        >
                                            {expertise}
                                        </button>
                                    ))}
                                </div>

                                {/* Special Card for Dr. Sarah Johnson */}
                                {!selectedTech && (
                                    <div className="max-w-4xl mx-auto mb-12">
                                        <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                                            <div className="grid md:grid-cols-2 gap-0">
                                                <div className="relative h-[400px] overflow-hidden">
                                                    <img
                                                        src="/yohanes.jpeg"
                                                        alt="Dr. Yohanes Hutagaol"
                                                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                                        <h3 className="text-2xl font-bold mb-2">Dr. Yohanes Hutagaol</h3>
                                                        <p className="text-lg opacity-90">Chief Medical Officer</p>
                                                    </div>
                                                </div>
                                                <div className="p-8 text-white">
                                                    <div className="mb-6">
                                                        <h4 className="text-xl font-semibold mb-3">Leadership & Vision</h4>
                                                        <p className="text-white/90 leading-relaxed">
                                                            20+ years of experience in healthcare management and digital transformation.
                                                            Leading our mission to revolutionize healthcare through technology.
                                                        </p>
                                                    </div>
                                                    <div className="mb-6">
                                                        <h4 className="text-xl font-semibold mb-3">Expertise</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["Healthcare IT", "Clinical Systems", "Patient Care"].map((skill) => (
                                                                <span
                                                                    key={skill}
                                                                    className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <a
                                                            href="https://linkedin.com/in/sarah-johnson"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                            </svg>
                                                            LinkedIn
                                                        </a>
                                                        <a
                                                            href="https://github.com/sarah-j"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                            </svg>
                                                            GitHub
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Regular Team Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {teamMembers
                                        .filter(member => member.name !== "Dr. Sarah Johnson" && (!selectedTech || member.expertise.includes(selectedTech)))
                                        .map((member, index) => (
                                            <TeamMemberCard key={member.name} member={member} />
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Technology Stack Section with Enhanced Cards */}
                        {activeTab === 'tech' && (
                            <div className="space-y-12">
                                {/* Tech Categories */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {techCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedTech(category.id === 'all' ? null : category.id)}
                                            className={`p-4 rounded-lg text-center transition-all duration-300 ${(selectedTech === category.id || (!selectedTech && category.id === 'all'))
                                                ? 'bg-blue-500 text-white shadow-lg scale-105'
                                                : 'bg-white text-gray-700 hover:bg-blue-50'
                                                }`}
                                        >
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p className="text-sm opacity-80">{category.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Tech Stack Visualization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-900">Technology Stack</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {technologies
                                                .filter(tech => !selectedTech || tech.category.toLowerCase() === selectedTech)
                                                .map((tech) => (
                                                    <TechnologyCard key={tech.name} tech={tech} />
                                                ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-900">Technology Usage</h3>
                                        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                                            {techUsage.map((usage) => (
                                                <TechUsageBar key={usage.technology} usage={usage} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Integration Examples */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Integration Examples</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Microservices Architecture</h4>
                                            <p className="text-gray-600">Go services communicating via gRPC with Next.js frontend</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">AI-Powered Analytics</h4>
                                            <p className="text-gray-600">TensorFlow models integrated with PostgreSQL for real-time insights</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Cloud Infrastructure</h4>
                                            <p className="text-gray-600">Kubernetes clusters managed with Terraform on AWS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* New Partners Section */}
                        {activeTab === 'partners' && (
                            <div className="space-y-12">
                                <div className="text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
                                    <p className="text-gray-600">Working together with industry leaders to transform healthcare.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {partners.map((partner) => (
                                        <PartnerCard key={partner.name} partner={partner} />
                                    ))}
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Partnership Benefits</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Innovation</h4>
                                            <p className="text-gray-600">Access to cutting-edge healthcare technology and research</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Resources</h4>
                                            <p className="text-gray-600">Shared expertise and resources for better patient care</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Growth</h4>
                                            <p className="text-gray-600">Opportunities for expansion and market reach</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Values Section */}
                        {activeTab === 'values' && (
                            <div className="space-y-12">
                                <div className="text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                                    <p className="text-gray-600">These principles guide everything we do, from patient care to technological innovation.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {values.map((value, index) => (
                                        <ValueCard key={value.title} value={value} index={index} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Impact Section */}
                        {activeTab === 'impact' && (
                            <div className="space-y-12">
                                <div className="text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
                                    <p className="text-gray-600">Making a real difference in healthcare through technology and innovation.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {impacts.map((impact) => (
                                        <ImpactCard key={impact.metric} impact={impact} />
                                    ))}
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Global Reach</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Countries Served</h4>
                                            <p className="text-3xl font-bold text-blue-500">25+</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Healthcare Partners</h4>
                                            <p className="text-3xl font-bold text-blue-500">500+</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <h4 className="font-semibold text-lg mb-2">Research Collaborations</h4>
                                            <p className="text-3xl font-bold text-blue-500">100+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Testimonials Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Partners Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* News & Updates Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Updates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {newsItems.map((news) => (
                                <NewsCard key={news.title} news={news} />
                            ))}
                        </div>
                    </div>

                    {/* Interactive Statistics Section */}
                    <div className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h2 className="text-3xl font-bold mb-8 text-center">Our Impact in Numbers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">{patients.toLocaleString()}</div>
                                <p className="text-blue-100">Patients Served</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">{uptime}%</div>
                                <p className="text-blue-100">System Uptime</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">{hospitals}+</div>
                                <p className="text-blue-100">Partner Hospitals</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">{support}/7</div>
                                <p className="text-blue-100">Support Hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 