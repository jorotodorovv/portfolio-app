import { ReactElement } from 'react'

import Header from './Header'
import Footer from './Footer'
import Background from './Background'
import { Providers } from './Providers'

export interface LayoutProps {
    children: ReactElement;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Providers>
                <Background />
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                <Footer />
            </Providers>
        </>
    )
}
