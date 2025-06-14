import Link from 'next/link'

interface ContentSectionProps {
    title: string
    links?: { text: string; href: string }[]
    description?: string
    actionLink?: { text: string; href: string }
}

export default function ContentSection({ title, links, description, actionLink }: ContentSectionProps) {
    return (
        <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
            {links && (
                <ul className="space-y-3">
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link href={link.href} className="text-blue-800 hover:underline">
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {actionLink && (
                <Link href={actionLink.href} className="text-blue-800 hover:underline">
                    {actionLink.text} →
                </Link>
            )}
        </section>
    )
} 