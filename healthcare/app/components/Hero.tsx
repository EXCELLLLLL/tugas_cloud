import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="bg-white rounded-xl shadow-sm p-0 mt-4">
            <h1 className="text-4xl md:text-5xl font-black font-montserrat text-gray-900 mb-4 px-8 pt-8">
                Cipta Hospital in Pamulang, South Tangerang
            </h1>
            <div className="rounded-2xl overflow-hidden mx-4 md:mx-8 mb-8">
                <Image
                    src="/ciptabuilding.jpg"
                    alt="Cipta Hospital in Pamulang, South Tangerang"
                    width={1200}
                    height={400}
                    className="w-full h-80 object-cover rounded-2xl"
                    priority
                />
            </div>
            <div className="flex flex-col md:flex-row md:items-start gap-8 px-8 pb-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold font-montserrat mb-4 text-gray-900">World-class care, focused on you</h2>
                    <Link
                        href="#"
                        className="inline-block bg-[#1664b0] text-white font-semibold px-6 py-3 rounded-full text-base shadow hover:bg-blue-900 transition"
                    >
                        Request an appointment
                    </Link>
                </div>
                <div className="md:w-1/2 text-base text-gray-900 font-montserrat space-y-4">
                    <p>
                        Welcome to Cipta Hospital, a trusted healthcare institution located in Pamulang, South Tangerang. As one of the leading private hospitals in the region, Cipta Hospital is committed to providing high-quality, patient-centered care for the community. Strategically situated in a rapidly growing suburban area just south of Jakarta, we serve thousands of patients each year with compassion, innovation, and medical excellence. From general care to specialized treatment, Cipta Hospital continues to expand its services to meet the evolving health needs of families in South Tangerang and beyond.
                    </p>
                    <p>
                        Cipta Hospital will always be your safe care destination.
                    </p>
                </div>
            </div>
        </section>
    )
} 