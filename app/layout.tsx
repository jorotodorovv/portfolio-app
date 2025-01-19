import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Background from '@/components/Background'
import PageTransition from '@/components/PageTransition'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Developer Portfolio',
  description: 'A software developer portfolio with blog and admin panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
        <Providers>
          <Background />
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

