'use client'
import React, { useEffect, useRef } from 'react'

// --- Animated Tech Background Component ---
const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let lastTime = 0
        // --- CHANGE: Reduced FPS to slow down the animation ---
        const fps = 10 
        const fpsInterval = 1000 / fps

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        const columns = Math.floor(canvas.width / 20)
        const drops = Array(columns).fill(1)

        const draw = (currentTime: number) => {
            animationFrameId = window.requestAnimationFrame(draw)
            const elapsed = currentTime - lastTime

            if (elapsed > fpsInterval) {
                lastTime = currentTime - (elapsed % fpsInterval)

                // --- CHANGE: Set the background to a semi-transparent gray ---
                // This creates the fading trail effect against a gray backdrop.
                // Using Tailwind's gray-800 color `rgb(31 41 55)`
                ctx.fillStyle = "rgba(31, 41, 55, 0.1)" 
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                ctx.fillStyle = "#58A0C8" // Cyan color for characters
                ctx.font = "16px monospace"

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length))
                    ctx.fillText(text, i * 20, drops[i] * 20)

                    if (drops[i] * 20 > canvas.height && Math.random() > 0.985) {
                        drops[i] = 0
                    }
                    drops[i]++
                }
            }
        }

        draw(0)

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    // Added bg-gray-900 as a base background color
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[-10] opacity-30 pointer-events-none z-[2]" />
}

export default AnimatedBackground
