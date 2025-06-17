"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BLOOD_TYPES = [
    '', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const SOCIAL_PLATFORMS = [
    { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
    { id: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yourhandle' },
    { id: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
];

function ProgressBar({ step }: { step: number }) {
    const steps = ['Personal', 'Medical', 'Insurance', 'Review'];
    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((label, idx) => (
                <div key={label} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${step === idx ? 'bg-[#0a3fa8]' : 'bg-gray-300'}`}>{idx + 1}</div>
                    <span className={`mt-2 text-xs font-semibold ${step === idx ? 'text-[#0a3fa8]' : 'text-gray-500'}`}>{label}</span>
                    {idx < steps.length - 1 && <div className="w-full h-1 bg-gray-200 mt-2 mb-2" />}
                </div>
            ))}
        </div>
    );
}

function ProfileCompletionBar({ percent }: { percent: number }) {
    return (
        <div className="mb-6">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-[#0a3fa8]">Profile Completion</span>
                <span className="text-sm font-medium text-[#0a3fa8]">{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#0a3fa8] h-2.5 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

type EmergencyContact = { name: string; phone: string };
type FormState = {
    fullName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    email: string;
    bloodType: string;
    allergies: string;
    medications: string;
    chronic: string;
    insuranceProvider: string;
    policyNumber: string;
};
type DraftState = FormState & {
    emergencyContacts: EmergencyContact[];
    profilePhoto: string | null;
    insuranceCard: string | null;
    about?: string;
    socialLinks?: { [key: string]: string };
    skills?: string[];
};
type ErrorsState = Partial<Record<keyof FormState, string>>;

export default function BioPage() {
    const { user, updateProfile, updateBioInformation, isAuthenticated } = useAuth();
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [draft, setDraft] = useState<DraftState | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [insuranceCard, setInsuranceCard] = useState<string | null>(null);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
        { name: '', phone: '' }
    ]);
    const [form, setForm] = useState<FormState>({
        fullName: '',
        dob: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        bloodType: '',
        allergies: '',
        medications: '',
        chronic: '',
        insuranceProvider: '',
        policyNumber: '',
    });
    const [errors, setErrors] = useState<ErrorsState>({});
    const [about, setAbout] = useState('');
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');

    // Pre-fill form with user data from auth service
    useEffect(() => {
        if (user) {
            setForm(prevForm => ({
                ...prevForm,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email
            }));
            setAbout(user.bio || '');
            setSocialLinks(user.socialLinks || {});
            setSkills(user.skills || []);
        }
    }, [user]);

    // File upload handlers
    function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => setProfilePhoto(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    function handleInsuranceCard(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => setInsuranceCard(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    // Emergency contacts
    function handleContactChange(idx: number, field: string, value: string) {
        setEmergencyContacts(contacts => contacts.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    }
    function addContact() {
        setEmergencyContacts([...emergencyContacts, { name: '', phone: '' }]);
    }
    function removeContact(idx: number) {
        setEmergencyContacts(contacts => contacts.filter((_, i) => i !== idx));
    }

    // Form navigation
    function nextStep() {
        if (validateStep()) setStep(s => s + 1);
    }
    function prevStep() {
        setStep(s => s - 1);
    }

    // Save as draft
    function saveDraft() {
        setDraft({ ...form, emergencyContacts, profilePhoto, insuranceCard, about, socialLinks, skills });
    }
    function loadDraft() {
        if (draft) {
            setForm(draft);
            setEmergencyContacts(draft.emergencyContacts || [{ name: '', phone: '' }]);
            setProfilePhoto(draft.profilePhoto || null);
            setInsuranceCard(draft.insuranceCard || null);
            setAbout(draft.about || '');
            setSocialLinks(draft.socialLinks || {});
            setSkills(draft.skills || []);
        }
    }

    // Validation
    function validateStep() {
        const stepErrors: ErrorsState = {};
        if (step === 0) {
            if (!form.fullName) stepErrors.fullName = 'Full name is required';
            if (!form.dob) stepErrors.dob = 'Date of birth is required';
            if (!form.gender) stepErrors.gender = 'Gender is required';
            if (!form.address) stepErrors.address = 'Address is required';
            if (!form.phone) stepErrors.phone = 'Phone is required';
            if (!form.email) stepErrors.email = 'Email is required';
        }
        if (step === 1) {
            if (!form.bloodType) stepErrors.bloodType = 'Blood type is required';
        }
        if (step === 2) {
            if (!form.insuranceProvider) stepErrors.insuranceProvider = 'Insurance provider is required';
            if (!form.policyNumber) stepErrors.policyNumber = 'Policy number is required';
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    }

    // Submission
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setShowModal(true);
    }
    async function confirmSubmit() {
        try {
            // Update user profile in auth service
            if (user) {
                const nameParts = form.fullName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                // Update basic profile information
                await updateProfile({
                    firstName,
                    lastName,
                    email: form.email
                });

                // Send complete bio information to auth service
                await updateBioInformation({
                    ...form,
                    emergencyContacts,
                    profilePhoto,
                    insuranceCard,
                    about,
                    socialLinks,
                    skills
                });
            }

            setShowModal(false);
            setSubmitted(true);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
            setShowModal(false);
        }
    }

    // Form field handler
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Profile completion calculation
    const completionPercent = (() => {
        let filled = 0;
        const total = 15 + SOCIAL_PLATFORMS.length + 1 + 1; // fields + socials + about + skills
        Object.values(form).forEach(v => { if (v) filled++; });
        SOCIAL_PLATFORMS.forEach(p => { if (socialLinks[p.id]) filled++; });
        if (about) filled++;
        if (skills.length > 0) filled++;
        return Math.round((filled / total) * 100);
    })();

    // Skill tag handlers
    function addSkill() {
        if (skillInput && !skills.includes(skillInput)) {
            setSkills([...skills, skillInput]);
            setSkillInput('');
        }
    }
    function removeSkill(skill: string) {
        setSkills(skills.filter(s => s !== skill));
    }

    // Social link handler
    function handleSocialChange(platform: string, value: string) {
        setSocialLinks({ ...socialLinks, [platform]: value });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7] font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                <h1 className="text-3xl font-extrabold text-[#0a3fa8] mb-6 text-center">Patient Bio Information</h1>

                {!isAuthenticated ? (
                    <div className="text-center py-12">
                        <div className="text-xl mb-4 text-red-600 font-bold">Authentication Required</div>
                        <div className="text-lg text-gray-700">Please log in to access your bio page.</div>
                    </div>
                ) : (
                    <>
                        <ProgressBar step={step} />
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="text-2xl mb-4 text-green-600 font-bold">Thank you!</div>
                                <div className="text-lg text-gray-700">Your information has been submitted successfully.</div>
                            </div>
                        ) : (
                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {/* Step 1: Personal */}
                                {step === 0 && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col items-center mb-4">
                                            <label className="block text-base font-bold text-gray-900 mb-2">Profile Photo</label>
                                            <input type="file" accept="image/*" onChange={handlePhoto} className="mb-2" />
                                            {profilePhoto && <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-[#0a3fa8]" />}
                                        </div>
                                        <div>
                                            <label htmlFor="fullName" className="block text-base font-bold text-gray-900 mb-1">Full Name</label>
                                            <input id="fullName" name="fullName" type="text" required value={form.fullName} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.fullName && <div className="text-red-600 text-sm mt-1">{errors.fullName}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="dob" className="block text-base font-bold text-gray-900 mb-1">Date of Birth</label>
                                            <input id="dob" name="dob" type="date" required value={form.dob} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.dob && <div className="text-red-600 text-sm mt-1">{errors.dob}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="gender" className="block text-base font-bold text-gray-900 mb-1">Gender</label>
                                            <select id="gender" name="gender" required value={form.gender} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]">
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <div className="text-red-600 text-sm mt-1">{errors.gender}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-base font-bold text-gray-900 mb-1">Address</label>
                                            <input id="address" name="address" type="text" required value={form.address} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-base font-bold text-gray-900 mb-1">Phone Number</label>
                                            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-base font-bold text-gray-900 mb-1">Email</label>
                                            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-base font-bold text-gray-900 mb-1">Emergency Contacts</label>
                                            {emergencyContacts.map((c, idx) => (
                                                <div key={idx} className="flex gap-2 mb-2">
                                                    <input type="text" placeholder="Name" value={c.name} onChange={e => handleContactChange(idx, 'name', e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                                    <input type="tel" placeholder="Phone" value={c.phone} onChange={e => handleContactChange(idx, 'phone', e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                                    {emergencyContacts.length > 1 && (
                                                        <button type="button" onClick={() => removeContact(idx)} className="text-red-600 font-bold px-2">✕</button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addContact} className="text-[#0a3fa8] font-bold mt-1">+ Add Contact</button>
                                        </div>
                                    </div>
                                )}
                                {/* Step 2: Medical */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="bloodType" className="block text-base font-bold text-gray-900 mb-1">Blood Type</label>
                                            <select id="bloodType" name="bloodType" required value={form.bloodType} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]">
                                                {BLOOD_TYPES.map(type => <option key={type} value={type}>{type || 'Select blood type'}</option>)}
                                            </select>
                                            {errors.bloodType && <div className="text-red-600 text-sm mt-1">{errors.bloodType}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="allergies" className="block text-base font-bold text-gray-900 mb-1">Allergies</label>
                                            <textarea id="allergies" name="allergies" rows={2} value={form.allergies} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" placeholder="List any allergies" />
                                        </div>
                                        <div>
                                            <label htmlFor="medications" className="block text-base font-bold text-gray-900 mb-1">Current Medications</label>
                                            <textarea id="medications" name="medications" rows={2} value={form.medications} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" placeholder="List any medications" />
                                        </div>
                                        <div>
                                            <label htmlFor="chronic" className="block text-base font-bold text-gray-900 mb-1">Chronic Conditions</label>
                                            <textarea id="chronic" name="chronic" rows={2} value={form.chronic} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" placeholder="List any chronic conditions" />
                                        </div>
                                    </div>
                                )}
                                {/* Step 3: Insurance */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="insuranceProvider" className="block text-base font-bold text-gray-900 mb-1">Insurance Provider</label>
                                            <input id="insuranceProvider" name="insuranceProvider" type="text" required value={form.insuranceProvider} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.insuranceProvider && <div className="text-red-600 text-sm mt-1">{errors.insuranceProvider}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="policyNumber" className="block text-base font-bold text-gray-900 mb-1">Policy Number</label>
                                            <input id="policyNumber" name="policyNumber" type="text" required value={form.policyNumber} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                            {errors.policyNumber && <div className="text-red-600 text-sm mt-1">{errors.policyNumber}</div>}
                                        </div>
                                        <div className="flex flex-col items-center mb-4">
                                            <label className="block text-base font-bold text-gray-900 mb-2">Upload Insurance Card</label>
                                            <input type="file" accept="image/*" onChange={handleInsuranceCard} className="mb-2" />
                                            {insuranceCard && <img src={insuranceCard} alt="Insurance Card" className="w-48 h-32 object-cover border-2 border-[#0a3fa8] rounded-lg" />}
                                        </div>
                                    </div>
                                )}
                                {/* Step 4: Review & Submit */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-[#0a3fa8] mb-4">Review Your Information</h2>
                                        <div className="space-y-2">
                                            <div><span className="font-bold">Full Name:</span> {form.fullName}</div>
                                            <div><span className="font-bold">Date of Birth:</span> {form.dob}</div>
                                            <div><span className="font-bold">Gender:</span> {form.gender}</div>
                                            <div><span className="font-bold">Address:</span> {form.address}</div>
                                            <div><span className="font-bold">Phone:</span> {form.phone}</div>
                                            <div><span className="font-bold">Email:</span> {form.email}</div>
                                            <div><span className="font-bold">Blood Type:</span> {form.bloodType}</div>
                                            <div><span className="font-bold">Allergies:</span> {form.allergies}</div>
                                            <div><span className="font-bold">Medications:</span> {form.medications}</div>
                                            <div><span className="font-bold">Chronic Conditions:</span> {form.chronic}</div>
                                            <div><span className="font-bold">Insurance Provider:</span> {form.insuranceProvider}</div>
                                            <div><span className="font-bold">Policy Number:</span> {form.policyNumber}</div>
                                            <div><span className="font-bold">Emergency Contacts:</span>
                                                <ul className="list-disc ml-6">
                                                    {emergencyContacts.map((c, idx) => (
                                                        <li key={idx}>{c.name} ({c.phone})</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {profilePhoto && <div><span className="font-bold">Profile Photo:</span> <img src={profilePhoto} alt="Profile" className="w-16 h-16 rounded-full inline-block ml-2 border-2 border-[#0a3fa8]" /></div>}
                                            {insuranceCard && <div><span className="font-bold">Insurance Card:</span> <img src={insuranceCard} alt="Insurance Card" className="w-24 h-16 inline-block ml-2 border-2 border-[#0a3fa8] rounded-lg" /></div>}
                                        </div>
                                    </div>
                                )}
                                {/* Navigation Buttons */}
                                <div className="flex justify-between gap-4 mt-8">
                                    {step > 0 && <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-full">Back</button>}
                                    {step < 3 && <button type="button" onClick={nextStep} className="bg-[#0a3fa8] text-white font-bold px-6 py-2 rounded-full">Next</button>}
                                    {step === 3 && <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded-full">Submit</button>}
                                    <button type="button" onClick={saveDraft} className="bg-yellow-100 text-yellow-800 font-bold px-6 py-2 rounded-full">Save as Draft</button>
                                    {draft && <button type="button" onClick={loadDraft} className="bg-blue-100 text-blue-800 font-bold px-6 py-2 rounded-full">Load Draft</button>}
                                </div>
                            </form>
                        )}
                    </>
                )}
                {/* Confirmation Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
                            <p className="mb-6">Are you sure you want to submit your information?</p>
                            <div className="flex justify-end gap-4">
                                <button onClick={() => setShowModal(false)} className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-full">Cancel</button>
                                <button onClick={confirmSubmit} className="bg-green-600 text-white font-bold px-6 py-2 rounded-full">Yes, Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
