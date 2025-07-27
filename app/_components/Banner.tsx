"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import type React from "react"
import { useRef, useEffect, useState } from "react"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

// --- AI Chat Modal Component ---
const AIChatModal = ({ isOpen, onClose, wssUrl }: { isOpen: boolean; onClose: () => void; wssUrl: string }) => {
    const [messages, setMessages] = useState<{ type: "user" | "ai" | "system"; text: string }[]>([])
    const [input, setInput] = useState("")
    const [ws, setWs] = useState<WebSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            const clientId = `client_${Math.random().toString(36).substr(2, 9)}`
            const socket = new WebSocket(`${wssUrl}/${clientId}`)

            socket.onopen = () => {
                setMessages([{ type: "system", text: "Connection established. Waiting for greeting..." }])
            }

            socket.onmessage = (event) => {
                setMessages((prev) => [...prev, { type: "ai", text: event.data }])
            }

            socket.onerror = () => {
                setMessages((prev) => [...prev, { type: "system", text: "Connection error. Please try again." }])
            }

            socket.onclose = () => {
                setMessages((prev) => [...prev, { type: "system", text: "Connection closed." }])
            }

            setWs(socket)
        } else {
            ws?.close()
        }

        return () => ws?.close()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, wssUrl])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = () => {
        if (input.trim() && ws?.readyState === WebSocket.OPEN) {
            setMessages((prev) => [...prev, { type: "user", text: input }])
            ws.send(input)
            setInput("")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Chat with my AI Assistant</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">
                        &times;
                    </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                            <span
                                className={`inline-block max-w-sm p-3 rounded-lg ${msg.type === "user"
                                    ? "bg-cyan-500 text-white"
                                    : msg.type === "ai"
                                        ? "bg-gray-700 text-gray-200"
                                        : "bg-transparent text-gray-500 text-sm italic text-center w-full"
                                    }`}
                            >
                                {msg.text}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-700 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        className="flex-grow bg-gray-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ask about my skills or projects..."
                    />
                    <button
                        onClick={handleSend}
                        className="bg-cyan-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Main Banner Component ---
const Banner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const photoRef = useRef<HTMLDivElement>(null)
    const [isChatOpen, setChatOpen] = useState(false)

    // IMPORTANT: Replace with your deployed AI backend URL
    const WSS_URL = "wss://ai-assitant-41cp.onrender.com/ws"

    useGSAP(
        () => {
            // Slower, more deliberate animation timeline
            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.4 } })

            tl.fromTo(".char", { y: 120, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 1 }) // Slower stagger and longer duration
                .fromTo(".fade-in-item", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 2 }, "-=0.5") // Slower stagger and longer duration
                .fromTo(
                    ".photo-container",
                    { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 10 },
                    { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0, duration: 2.0 },
                    "-=1.2",
                ) // Slower reveal

            // Floating animation for photo
            gsap.to(".photo-container", {
                y: 0,
                duration: 2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            })

            // Parallax effect on scroll
            gsap.to(".photo-container img", {
                scale: 1.1,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                },
            })
        },
        { scope: containerRef },
    )

    const stats = [
        { value: "2+", label: "Years of Experience" },
        { value: "7+", label: "Completed Projects" },
        { value: "8K+", label: "Hours Worked" },
    ]

    return (
        <section className="relative h-[100svh] min-h-[700px] w-full overflow-hidden text-white" id="banner" ref={containerRef}>
            {/* The z-20 here establishes a stacking context for the banner content */}
            <div className="relative z-20 container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
                <div className="flex-1 max-w-2xl">
                    <h1 className="leading-[.95] text-6xl sm:text-[80px] font-anton uppercase">
                        <span className="text-[#5EABD6] block overflow-hidden">
                            {"FULL STACK".split("").map((c, i) => <span key={i} className="char inline-block">{c === " " ? "\u00A0" : c}</span>)}
                        </span>
                        <span className="block md:ml-4 overflow-hidden">
                            {"DEVELOPER".split("").map((c, i) => <span key={i} className="char inline-block">{c === " " ? "\u00A0" : c}</span>)}
                        </span>
                    </h1>
                    <p className="fade-in-item mt-6 text-lg text-gray-300 max-w-lg">
                        Hi! I'm Anubhav. A Full Stack Developer with 2+ years of experience in building high-performance, scalable, and responsive web solutions.
                    </p>
                    <div className="fade-in-item flex flex-wrap gap-4 mt-9">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="group relative inline-block px-8 py-4 text-lg font-semibold bg-[#5EABD6] text-black rounded-full overflow-hidden transition-transform duration-300 hover:scale-105">
                            <span className="relative z-10">Hire Me</span>
                        </a>
                        <button
                            onClick={() => window.open('/resume.pdf', '_blank')}
                            className="group relative inline-block px-8 py-4 text-lg font-semibold bg-[#1B3C53] text-white rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 hover:bg-gray-600"
                        >
                            <span className="relative z-10">Resume</span>
                        </button>
                    </div>
                </div>
                <div className="hidden lg:flex flex-1 justify-center items-center px-8 py-12">
                    <div ref={photoRef} className="photo-container relative" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
                        <div className="relative w-72 h-80 transform-gpu" style={{ transform: "rotateY(-8deg) rotateX(5deg)", transformStyle: "preserve-3d", margin: "40px" }}>
                            <div className="absolute inset-0 bg-black opacity-25 blur-xl transform translate-x-6 translate-y-6 rounded-2xl"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-600" style={{ boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.3)` }}>
                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-1 shadow-inner">
                                    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800 relative">
                                        <img src="/profile.png" alt="Anubhav - Full Stack Developer" className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                                        <div className="absolute inset-0 shadow-inner rounded-lg pointer-events-none" style={{ boxShadow: "inset 0 0 20px rgba(6, 182, 212, 0.1)" }}></div>
                                    </div>
                                </div>
                                <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm"></div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-tl from-[#5EABD6]/20 to-transparent rounded-full blur-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex flex-col gap-8 text-right ml-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="fade-in-item">
                            <h5 className="text-3xl sm:text-4xl font-anton text-[#5EABD6] mb-1">{stat.value}</h5>
                            <p className="text-gray-400 text-sm whitespace-nowrap">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="fade-in-item">
                            <h5 className="text-2xl font-anton text-[#5EABD6] mb-1">{stat.value}</h5>
                            <p className="text-gray-400 text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <AIChatModal isOpen={isChatOpen} onClose={() => setChatOpen(false)} wssUrl={WSS_URL} />
        </section>
    )
}

export default Banner
