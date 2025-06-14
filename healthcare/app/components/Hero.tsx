import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="bg-white rounded-xl shadow-sm p-0 mt-4">
            <h1 className="text-4xl md:text-5xl font-black font-montserrat text-gray-900 mb-4 px-8 pt-8">
                Mayo Clinic in Rochester, Minnesota
            </h1>
            <div className="rounded-2xl overflow-hidden mx-4 md:mx-8 mb-8">
                <Image
                    src="/rochester.jpg"
                    alt="Mayo Clinic in Rochester, Minnesota"
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
                        Welcome to Mayo Clinic in Rochester, Minnesota, the original and largest Mayo Clinic campus. Located in the heart of Rochester, Minnesota — a dynamic city just 90 minutes south of the Twin Cities of Minneapolis and St. Paul — Mayo Clinic has been safely caring for patients from around the world for more than 100 years.
                    </p>
                    <p>
                        Mayo Clinic will always be your safe care destination.
                    </p>
                </div>
            </div>
        </section>
    )
} 