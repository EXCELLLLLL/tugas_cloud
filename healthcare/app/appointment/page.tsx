"use client";
import { useState } from 'react';

export default function AppointmentPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        dob: '',
        contact: '',
        doctor: '',
        date: '',
        time: '',
        reason: '',
        document: null as File | null,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [docPreview, setDocPreview] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, files } = e.target as any;
        if (name === 'document' && files && files[0]) {
            setForm(f => ({ ...f, document: files[0] }));
            const reader = new FileReader();
            reader.onload = ev => setDocPreview(ev.target?.result as string);
            reader.readAsDataURL(files[0]);
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    }

    function validate() {
        const newErrors: { [key: string]: string } = {};
        if (!form.name) newErrors.name = 'Patient name is required';
        if (!form.dob) newErrors.dob = 'Date of birth is required';
        if (!form.contact) newErrors.contact = 'Contact info is required';
        if (!form.doctor) newErrors.doctor = 'Preferred doctor is required';
        if (!form.date) newErrors.date = 'Appointment date is required';
        if (!form.time) newErrors.time = 'Appointment time is required';
        if (!form.reason) newErrors.reason = 'Reason for visit is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (validate()) setSubmitted(true);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7] font-sans">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                <h1 className="text-3xl font-extrabold text-[#0a3fa8] mb-6 text-center">Request an Appointment</h1>
                {submitted ? (
                    <div className="text-center py-12">
                        <div className="text-2xl mb-4 text-green-600 font-bold">Request Sent!</div>
                        <div className="text-lg text-gray-700">Your appointment request has been submitted. We will contact you soon.</div>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-base font-bold text-gray-900 mb-1">Patient Name</label>
                            <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-base font-bold text-gray-900 mb-1">Date of Birth</label>
                            <input id="dob" name="dob" type="date" required value={form.dob} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                            {errors.dob && <div className="text-red-600 text-sm mt-1">{errors.dob}</div>}
                        </div>
                        <div>
                            <label htmlFor="contact" className="block text-base font-bold text-gray-900 mb-1">Contact Info</label>
                            <input id="contact" name="contact" type="text" required value={form.contact} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                            {errors.contact && <div className="text-red-600 text-sm mt-1">{errors.contact}</div>}
                        </div>
                        <div>
                            <label htmlFor="doctor" className="block text-base font-bold text-gray-900 mb-1">Preferred Doctor</label>
                            <input id="doctor" name="doctor" type="text" required value={form.doctor} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                            {errors.doctor && <div className="text-red-600 text-sm mt-1">{errors.doctor}</div>}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="date" className="block text-base font-bold text-gray-900 mb-1">Appointment Date</label>
                                <input id="date" name="date" type="date" required value={form.date} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                {errors.date && <div className="text-red-600 text-sm mt-1">{errors.date}</div>}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="time" className="block text-base font-bold text-gray-900 mb-1">Appointment Time</label>
                                <input id="time" name="time" type="time" required value={form.time} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                                {errors.time && <div className="text-red-600 text-sm mt-1">{errors.time}</div>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-base font-bold text-gray-900 mb-1">Reason for Visit</label>
                            <textarea id="reason" name="reason" rows={3} required value={form.reason} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]" />
                            {errors.reason && <div className="text-red-600 text-sm mt-1">{errors.reason}</div>}
                        </div>
                        <div>
                            <label htmlFor="document" className="block text-base font-bold text-gray-900 mb-1">Upload Supporting Document (optional)</label>
                            <input id="document" name="document" type="file" accept="application/pdf,image/*" onChange={handleChange} className="block w-full" />
                            {docPreview && (
                                <div className="mt-2">
                                    <span className="text-xs text-gray-600">Preview:</span>
                                    <div className="mt-1">
                                        <img src={docPreview} alt="Document Preview" className="max-h-32 rounded border" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-[#0a3fa8] hover:bg-[#083080] text-white font-extrabold py-3 rounded-full text-xl transition-colors shadow-md">Submit Request</button>
                    </form>
                )}
            </div>
        </div>
    );
} 