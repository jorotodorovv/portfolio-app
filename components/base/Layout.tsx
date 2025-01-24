import Header from './Header'
import Footer from './Footer'
import Background from './Background'
import PageTransition from '../Transition'
import { Providers } from './Providers'
import { ReactNode } from 'react'

export interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children } : LayoutProps) {
    return (
        <>
            <Providers>
                <Background />
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
            </Providers>
        </>
    )
}
