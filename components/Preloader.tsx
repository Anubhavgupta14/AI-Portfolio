'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useMemo } from 'react';

// It's good practice to register plugins once, ideally in your app's entry point,
// but for a self-contained component, this is fine.
gsap.registerPlugin(useGSAP);

// --- Component Props ---
interface PreloaderProps {
    name?: string;
    subtitle?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ 
    name = "ANUBHAV", 
    subtitle = "Welcome to my digital world." 
}) => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Memoize the grid squares to prevent re-generation on re-renders
    const gridSquares = useMemo(() => {
        return Array.from({ length: 200 }, (_, i) => <div key={i} className="grid-cell bg-gray-900" />);
    }, []);

    useGSAP(
        () => {
            // --- GSAP Timeline ---
            const tl = gsap.timeline({
                // This onComplete will hide the preloader entirely after the animation,
                // preventing it from capturing mouse events.
                onComplete: () => {
                    if (preloaderRef.current) {
                        preloaderRef.current.style.display = 'none';
                    }
                },
            });

            // 1. Animate the name letters into view
            tl.fromTo(
                '.name-char',
                { y: 150, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 1,
                    ease: 'power3.out',
                },
            );

            // 2. Animate the subtitle into view
            tl.fromTo(
                '.subtitle-text',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                },
                '-=0.5', // Start this animation slightly before the name animation finishes
            );
            
            // 3. Animate the text out
            tl.to(
                '.text-container',
                {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in',
                },
                '+=1', // Wait for 1 seconds after the previous animation
            );

            // 4. Animate the pixel grid dissolution effect
            tl.fromTo(
                '.grid-cell',
                { scale: 0 },
                {
                    scale: 1,
                    duration: 1,
                    stagger: {
                        amount: 1,
                        from: 'random',
                        ease: 'power2.inOut',
                    },
                },
                '-=0.5', // Overlap with the text fading out
            );
            
            // 5. Fade out the entire preloader background
            tl.to(preloaderRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: 'power1.in',
            });

        },
        { scope: preloaderRef }, // Scope the animations to this component
    );

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950 text-white" 
            ref={preloaderRef}
        >
            {/* Container for the animated text */}
            <div className="text-container text-center">
                <h1 className="name-text text-5xl md:text-8xl font-bold uppercase tracking-wider overflow-hidden">
                    {name.split('').map((char, index) => (
                        <span key={index} className="name-char inline-block">
                            {/* Use non-breaking space for spaces to ensure they are rendered */}
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </h1>
                <p className="subtitle-text text-lg md:text-2xl text-gray-400 mt-4 font-light tracking-widest">
                    {subtitle}
                </p>
            </div>

            {/* Grid container for the dissolution effect */}
            <div 
                className="absolute inset-0 grid grid-cols-20 grid-rows-10 w-full h-full pointer-events-none"
                ref={gridRef}
            >
                {gridSquares}
            </div>
        </div>
    );
};

export default Preloader;
