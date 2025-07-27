'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef(null);

    // GSAP animation for elements sliding up and fading in on scroll
    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top 80%', // Start animation when 80% of the component is in view
                    end: 'bottom bottom',
                    toggleActions: 'play none none none', // Play animation once on enter
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 100,
                opacity: 0,
                stagger: 0.2, // Stagger the animation for each element
                duration: 0.8,
                ease: 'power3.out',
            });
        },
        { scope: container },
    );

    return (
        <section className="py-24 sm:py-32 text-white overflow-hidden" id="about-me">
            <div className="container mx-auto px-4" ref={container}>
                {/* Main grid layout */}
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Image */}
                    <div className="lg:col-span-5 flex justify-center">
                        <div className="relative w-[300px] h-[400px] sm:w-[350px] sm:h-[460px] floating-image slide-up-and-fade">
                             {/* 3D Frame Effect */}
                            <div
                                className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-600"
                                style={{
                                    boxShadow: `
                                        0 25px 50px -12px rgba(0, 0, 0, 0.8),
                                        0 0 0 1px rgba(255, 255, 255, 0.1),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                                        inset 0 -1px 0 rgba(0, 0, 0, 0.3)
                                    `,
                                }}
                            >
                                {/* Inner Frame */}
                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-1 shadow-inner">
                                    {/* Photo */}
                                    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800 relative">
                                        <img 
                                            src="/work.png" 
                                            alt="Anubhav Gupta - Full Stack Developer at work" 
                                            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-110"
                                            onError={(e) => e.currentTarget.src = 'https://placehold.co/400x550/111827/ffffff?text=Image+Not+Found'}
                                        />
                                        {/* Glass reflection effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                                        {/* Subtle glow */}
                                        <div
                                            className="absolute inset-0 shadow-inner rounded-lg pointer-events-none"
                                            style={{
                                                boxShadow: "inset 0 0 20px rgba(6, 182, 212, 0.1)",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                {/* Frame highlights */}
                                <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm"></div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-tl from-[#5EABD6]/20 to-transparent rounded-full blur-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="lg:col-span-7">
                        <p className="text-sm font-semibold text-[#5EABD6] uppercase tracking-wider slide-up-and-fade">
                            About Me
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 slide-up-and-fade">
                            Hi, I&apos;m Anubhav Gupta.
                        </h2>
                        <div className="mt-6 text-lg text-gray-300 space-y-4 max-w-xl">
                            <p className="slide-up-and-fade">
                                I&apos;m a <strong>Full Stack Developer</strong> dedicated to building high-performance, scalable web solutions. I specialize in developing robust applications, from large-scale SaaS platforms to <strong>AI-powered tools</strong>.
                            </p>
                            <p className="slide-up-and-fade">
                                My approach focuses on engineering solutions that meet both user needs and strategic business goals. By leveraging advanced frameworks like <strong>Next.js</strong> and integrating <strong>AI/LLMs</strong>, I deliver secure, efficient, and user-centric experiences that boost conversions, optimize performance, and streamline operations for multiple online platforms and major brands.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Introductory quote section */}
                 <div className="mt-24 sm:mt-32 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-light text-gray-200 slide-up-and-fade">
                        “I&apos;m dedicated to achieving perfection through collaboration, working closely with clients to understand their vision and delivering solutions that are precisely tailored to their specific needs and aspirations.”
                    </h3>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
