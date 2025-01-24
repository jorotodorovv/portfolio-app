import './globals.css'

import { Inter } from 'next/font/google'
import Layout, { LayoutProps } from '@/components/base/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Developer Portfolio',
  description: 'A software developer portfolio with blog and admin panel',
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}

