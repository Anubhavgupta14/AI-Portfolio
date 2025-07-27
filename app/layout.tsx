import type { Metadata } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ReactLenis } from 'lenis/react';

import 'lenis/dist/lenis.css';
import './globals.css';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Preloader from '../components/Preloader';
import StickyEmail from './_components/StickyEmail';
import { GoogleAnalytics } from '@next/third-parties/google';
import AnimatedBackground from './_components/Animatedbg';
import Script from 'next/script';

const antonFont = Anton({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-anton',
});

const robotoFlex = Roboto_Flex({
    weight: ['100', '400', '500', '600', '700', '800'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-roboto-flex',
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta-sans',
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    style: ['normal', 'italic'],
  })

export const metadata: Metadata = {
    title: 'Anubhav Gupta',
    description: 'Personal portfolio of Anubhav Gupta',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <GoogleAnalytics gaId="G-11ET7SCM82" />
            <body
                className={`${antonFont.variable} ${robotoFlex.variable} ${plusJakartaSans.className} antialiased`}
            >
                <ReactLenis
                    root
                    options={{
                        lerp: 0.1,
                        duration: 1.4,
                    }}
                >
                    <div className="relative w-full min-h-screen">
                        <AnimatedBackground />
                        <div className="relative z-10">
                            <Navbar />
                            <main>{children}</main>
                            <Footer />
                            <Preloader />
                            <ScrollProgressIndicator />
                            <StickyEmail />
                        </div>
                    </div>
                </ReactLenis>
            </body>
        </html>
    );
}
