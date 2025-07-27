'use client'
import { useRef, useEffect } from 'react';

const CustomCursor = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        // For a smoother experience, we disable the custom cursor on touch devices.
        if ("ontouchstart" in window) {
            if (svgRef.current) {
                svgRef.current.style.display = 'none';
            }
            return;
        }

        const svg = svgRef.current;
        if (!svg) return;

        // Set the initial state of the cursor
        svg.style.transform = 'translate(-50%, -50%) scale(0.5)';
        svg.style.opacity = '0';
        svg.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';

        let isVisible = false;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let animationId: number;

        // Smooth interpolation for cursor movement
        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        const updatePosition = () => {
            currentX = lerp(currentX, targetX, 0.15); // Faster lerp factor
            currentY = lerp(currentY, targetY, 0.15);
            
            const scale = isVisible ? (svg.classList.contains('scaled') ? 1.5 : 1) : 0.5;
            svg.style.transform = `translate(${currentX - 15}px, ${currentY - 15}px) scale(${scale})`;
            
            // Continue animation if there's still movement needed
            if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
                animationId = requestAnimationFrame(updatePosition);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            
            // On the first mouse move, make the cursor appear
            if (!isVisible) {
                svg.style.opacity = '1';
                svg.style.transform = `translate(${clientX - 15}px, ${clientY - 15}px) scale(1)`;
                currentX = clientX;
                currentY = clientY;
                isVisible = true;
            }
            
            // Update target position
            targetX = clientX;
            targetY = clientY;
            
            // Cancel previous animation and start new one
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(updatePosition);
        };

        // Interactive Hover Effect with faster transitions
        const handleMouseEnter = () => {
            svg.classList.add('scaled');
            svg.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        };

        const handleMouseLeave = () => {
            svg.classList.remove('scaled');
            svg.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        };

        // Add event listeners
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        
        // Use event delegation for better performance
        document.addEventListener("mouseenter", (e) => {
            const target = e.target as Element;
            if (target.matches('a, button, [role="button"], input, textarea, select')) {
                handleMouseEnter();
            }
        }, true);
        
        document.addEventListener("mouseleave", (e) => {
            const target = e.target as Element;
            if (target.matches('a, button, [role="button"], input, textarea, select')) {
                handleMouseLeave();
            }
        }, true);

        // Cleanup function
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            width="30"
            height="30"
            viewBox="0 0 27 30"
            className="hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none"
            fill="none"
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
            style={{ willChange: 'transform' }} // Optimize for transforms
        >
            <path
                d="M20.0995 11.0797L3.72518 1.13204C2.28687 0.258253 0.478228 1.44326 0.704999 3.11083L3.28667 22.0953C3.58333 24.2768 7.33319 24.6415 8.3792 22.7043C9.5038 20.6215 10.8639 18.7382 12.43 17.7122C13.996 16.6861 16.2658 16.1911 18.6244 15.9918C20.8181 15.8063 21.9811 12.2227 20.0995 11.0797Z"
                className="fill-cyan-400 stroke-gray-900" 
            />
        </svg>
    );
};

export default CustomCursor;