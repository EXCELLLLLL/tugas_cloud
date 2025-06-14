'use client';

import Hero from './components/Hero'
import Breadcrumbs from './components/Breadcrumbs'

export default function Home() {
  const planningLinks = [
    { text: 'Rochester construction updates', href: '#' },
    { text: 'Getting here', href: '#' },
    { text: 'Travel help & guidance', href: '#' },
    { text: 'Concierge services', href: '#' },
    { text: 'Your packing list', href: '#' },
    { text: 'Campus maps & help getting around', href: '#' },
    { text: 'Accessibility (mobility, visual and hearing help)', href: '#' },
    { text: 'Parking', href: '#' },
    { text: 'Hotels & lodging', href: '#' },
    { text: 'Places to eat', href: '#' },
    { text: 'International services', href: '#' },
    { text: 'Visiting Mayo Clinic discussion board', href: '#' },
    { text: 'Support groups', href: '#' },
    { text: 'Social work', href: '#' },
    { text: 'Spiritual and religious services', href: '#' },
    { text: 'Clinical Ethics Consultation Service', href: '#' },
    { text: 'Interpreter services', href: '#' },
    { text: 'Patient education', href: '#' },
    { text: 'Humanities in Medicine', href: '#' },
  ]

  const helpLinks = [
    { text: 'Billing & Insurance', href: '#' },
    { text: 'Cost Estimator', href: '#' },
    { text: 'Charitable Care & Financial Assistance', href: '#' },
    { text: 'Medical images & records request', href: '#' },
    { text: 'Pharmacy', href: '#' },
    { text: 'Medical supplies & equipment', href: '#' },
    { text: 'Gift shops & online bookstore', href: '#' },
    { text: 'Optical store', href: '#' },
    { text: 'COVID-19 info for cancer patients', href: '#' },
    { text: 'COVID-19 info for transplant patients', href: '#' },
    { text: 'Patient appointment and visitor updates', href: '#' },
  ]

  function splitLinks(links: { text: string, href: string }[]) {
    const half = Math.ceil(links.length / 2)
    return [links.slice(0, half), links.slice(half)]
  }

  const [planningCol1, planningCol2] = splitLinks(planningLinks)
  const [helpCol1, helpCol2] = splitLinks(helpLinks)

  return (
    <div className="w-full bg-[#f5f6f7] min-h-screen font-sans">
      <main className="max-w-screen-xl mx-auto px-4 py-12">
        <Breadcrumbs />
        <Hero />

        {/* Planning your trip here */}
        <section className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a3fa8] mb-8">Planning your trip here</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <ul className="divide-y divide-gray-200">
              {planningCol1.map(link => (
                <li key={link.text} className="py-3 flex items-center justify-between group">
                  <a href={link.href} className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">{link.text}</a>
                  <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
                </li>
              ))}
            </ul>
            <ul className="divide-y divide-gray-200 mt-6 md:mt-0">
              {planningCol2.map(link => (
                <li key={link.text} className="py-3 flex items-center justify-between group">
                  <a href={link.href} className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">{link.text}</a>
                  <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="my-12 border-gray-300" />

        {/* Additional help to make the most of your visit */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a3fa8] mb-8">Additional help to make the most of your visit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <ul className="divide-y divide-gray-200">
              {helpCol1.map(link => (
                <li key={link.text} className="py-3 flex items-center justify-between group">
                  <a href={link.href} className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">{link.text}</a>
                  <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
                </li>
              ))}
            </ul>
            <ul className="divide-y divide-gray-200 mt-6 md:mt-0">
              {helpCol2.map(link => (
                <li key={link.text} className="py-3 flex items-center justify-between group">
                  <a href={link.href} className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">{link.text}</a>
                  <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* New Sections Below */}
        <section className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          {/* Learn about Rochester, Minnesota */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a3fa8] mb-8">Learn about Rochester, Minnesota</h2>
          <p className="text-lg text-gray-900 mb-6">Discover more about this Midwest destination.</p>
          <ul className="divide-y divide-gray-200 mb-12 max-w-2xl">
            <li className="py-3 flex items-center justify-between group">
              <a href="#" className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">Experience Rochester MN</a>
              <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
            </li>
          </ul>

          {/* Wellness services to enhance your onsite experience */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a3fa8] mb-8">Wellness services to enhance your onsite experience</h2>
          <p className="text-lg text-gray-900 mb-6">We offer a variety of wellness services including spa services, healthy living classes, and more to help make your stay both comfortable and enjoyable.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mb-12">
            <ul className="divide-y divide-gray-200">
              <li className="py-3 flex items-center justify-between group">
                <a href="#" className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">Rejuvenate spa services</a>
                <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
              </li>
            </ul>
            <ul className="divide-y divide-gray-200 mt-6 md:mt-0">
              <li className="py-3 flex items-center justify-between group">
                <a href="#" className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">All wellness services</a>
                <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
              </li>
            </ul>
          </div>

          {/* Be a blood donor */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a3fa8] mb-8">Be a blood donor</h2>
          <p className="text-lg text-gray-900 mb-6">Each whole blood donation can help save lives.</p>
          <ul className="divide-y divide-gray-200 mb-12 max-w-2xl">
            <li className="py-3 flex items-center justify-between group">
              <a href="#" className="text-lg font-semibold text-[#0a3fa8] hover:underline flex-1">Learn more about the Blood Donor Program</a>
              <span className="text-[#0a3fa8] text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
            </li>
          </ul>
        </section>

      </main>
    </div>
  )
}
