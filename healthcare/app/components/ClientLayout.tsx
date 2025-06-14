'use client';

import { usePathname } from 'next/navigation';
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <>
      {isMainPage && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {isMainPage && <Footer />}
    </>
  );
}