'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MoveUpRight, Bot, Mic, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';

// --- CONSTANTS ---
const COLORS = [
    'bg-yellow-500 text-black',
    'bg-blue-500 text-white',
    'bg-teal-500 text-black',
    'bg-indigo-500 text-white',
];

const MENU_LINKS = [
    { name: 'Home', url: '/' },
    { name: 'About Me', url: '/#about-me' },
    { name: 'Experience', url: '/#my-experience' },
    { name: 'Projects', url: '/#selected-projects' },
];

// Type definitions for better TypeScript support
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}
declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    // NEW: Track whether to auto-listen after speaking (disable when user stops speech)
    const [autoListen, setAutoListen] = useState(true);

    const router = useRouter();
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    // For positioning panel
    const aiBtnRef = useRef<HTMLButtonElement>(null);
    const [assistantModalStyle, setAssistantModalStyle] = useState<React.CSSProperties>({});

    const clientId = `client_${Math.random().toString(36).substr(2, 9)}`;
    const WEBSOCKET_URL = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/${clientId}`;

    // -- Cleanup function --
    const cleanup = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch { }
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
        }
        window.speechSynthesis.cancel();
        setIsListening(false);
        setIsConnected(false);
        setError(null);
    }, []);

    // -- Speech Recognition setup --
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech Recognition not supported by this browser.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onstart = () => { setIsListening(true); setError(null); };
        recognition.onend = () => { setIsListening(false); };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error === 'network') {
                setError('Voice recognition failed to connect. Please use Google Chrome.');
            } else if (event.error === 'no-speech') {
                // Graceful: don't set error, just stop listening
            } else {
                setError(`Speech recognition error: ${event.error}`);
            }
            setIsListening(false);
        };
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const currentTranscript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');
            setTranscript(currentTranscript);
            // Send final transcript via WebSocket
            if (event.results[0]?.isFinal && socketRef.current?.readyState === WebSocket.OPEN) {
                const message = currentTranscript.trim();
                if (message) {
                    setIsThinking(true);
                    try {
                        socketRef.current.send(JSON.stringify({
                            type: 'voice_input',
                            message: message,
                            timestamp: Date.now()
                        }));
                    } catch {
                        socketRef.current.send(message);
                    }
                }
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.onstart = null;
            recognition.onend = null;
            recognition.onerror = null;
            recognition.onresult = null;
        };
    }, []);

    // -- Modal panel: Update position under the AI button --
    useEffect(() => {
        if (isAssistantOpen && aiBtnRef.current) {
            const rect = aiBtnRef.current.getBoundingClientRect();
            setAssistantModalStyle({
                position: "fixed",
                top: rect.bottom + 14,
                right: window.innerWidth - rect.right,
                zIndex: 60,
                minWidth: 340,
                maxWidth: 420,
            });
        }
    }, [isAssistantOpen]);

    // -- Websocket connect when open --
    useEffect(() => {
        if (!isAssistantOpen) {
            cleanup();
            return;
        }

        try {
            const socket = new WebSocket(WEBSOCKET_URL);
            socketRef.current = socket;

            socket.onopen = () => {
                setIsConnected(true);
                setError(null);
            };
            socket.onmessage = (event) => {
                let responseText: string;
                setIsThinking(false);
                try {
                    const data = JSON.parse(event.data);
                    responseText = data.message || data.text || data.response || String(data);
                } catch (e) {
                    responseText = String(event.data);
                }

                // SPEECH: Read out the response
                if ('speechSynthesis' in window && responseText.trim()) {
                    window.speechSynthesis.cancel();
                    const voices = window.speechSynthesis.getVoices();
                    const rishiVoice = voices.find(
                        v => v.name === "Google UK English Male" && v.lang === "en-GB"
                    );
                    const utterance = new SpeechSynthesisUtterance(responseText);
                    if (rishiVoice) {
                        utterance.voice = rishiVoice;
                    } else {
                        // fallback if Rishi isn't found
                        utterance.voice = voices[0];
                    }
                    utterance.rate = 1.2;
                    utterance.pitch = 0.7;
                    utterance.volume = 1;

                    utterance.onend = () => {
                        // Only restart listening if panel is still open and user has NOT stopped auto listening
                        if (isAssistantOpen && autoListen && recognitionRef.current) {
                            setTimeout(() => {
                                try { recognitionRef.current?.start(); } catch { }
                            }, 400);
                        }
                    };

                    utterance.onerror = () => {/* optional: set error if desired */ };

                    window.speechSynthesis.speak(utterance);
                }
            };
            socket.onerror = () => {
                setIsThinking(false);
                setError('Connection error occurred');
                setIsConnected(false);
            };
            socket.onclose = (event) => {
                setIsThinking(false);
                setIsConnected(false);
                if (event.code !== 1000) setError('Connection lost');
            };
        } catch {
            setError('Failed to connect to assistant service');
        }
        return cleanup;
        // Note: autoListen is purposefully NOT in deps to avoid effect restart-loop
        // eslint-disable-next-line
    }, [isAssistantOpen, cleanup]);

    // -- NEW: When opening AI Assistant, autostart listening
    useEffect(() => {
        if (isAssistantOpen && recognitionRef.current) {
            setAutoListen(true); // always auto-listen on open
            setTimeout(() => {
                try { recognitionRef.current?.start(); } catch { }
            }, 300);
        }
    }, [isAssistantOpen]);

    // --- Handler: Toggle Assistant Modal ---
    const handleAssistantToggle = () => {
        setIsAssistantOpen(!isAssistantOpen);
        setTranscript('');
        setError(null);
        setAutoListen(true); // always reset to auto-listen on open
        window.speechSynthesis.cancel();
        setTimeout(() => setTranscript(''), 300);
    };
    const handleMenuClick = (url: string) => {
        router.push(url);
        setIsMenuOpen(false);
    };

    // --- Manual Controls (Mic, Stop Speech) ---
    const handleMicStart = () => {
        setError(null);
        setAutoListen(true);
        try { recognitionRef.current?.start(); } catch (e) { setError('Could not start mic.'); }
    };
    const handleMicStop = () => {
        setAutoListen(false); // disables further autolisten after speech
        try { recognitionRef.current?.stop(); setIsListening(false); } catch { }
    };
    const handleSpeechStop = () => {
        window.speechSynthesis.cancel();
        // Disable auto-relisten after speech
        setAutoListen(false);
        // Also stop mic if active
        try { recognitionRef.current?.stop(); } catch { }
        setIsListening(false);
    };

    return (
        <>
            {/* Top right buttons container */}
            <div className="fixed top-5 right-5 md:right-10 z-50 flex items-center gap-2">
                {/* AI Assistant Button */}
                <button
                    ref={aiBtnRef}
                    className={cn(
                        "group size-12 flex items-center justify-center rounded-full transition-all duration-300",
                        isAssistantOpen
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-white/10 text-white"
                    )}
                    onClick={handleAssistantToggle}
                    aria-label={isAssistantOpen ? "Close AI Assistant" : "Open AI Assistant"}
                >
                    <Bot className={cn(
                        "transition-transform duration-300",
                        isAssistantOpen ? "scale-110" : "group-hover:scale-110"
                    )} />
                </button>

                {/* Hamburger Menu Button */}
                <button
                    className="group size-12 relative"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                >
                    <span className={cn(
                        'inline-block w-3/5 h-0.5 bg-white rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 -translate-y-[5px]',
                        { 'rotate-45 -translate-y-1/2': isMenuOpen, 'md:group-hover:rotate-12': !isMenuOpen }
                    )}></span>
                    <span className={cn(
                        'inline-block w-3/5 h-0.5 bg-white rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 translate-y-[5px]',
                        { '-rotate-45 -translate-y-1/2': isMenuOpen, 'md:group-hover:-rotate-12': !isMenuOpen }
                    )}></span>
                </button>
            </div>

            {/* AI Assistant Panel (top right, under AI button) */}
            {isAssistantOpen && (
                <div
                    style={assistantModalStyle}
                    className="bg-gray-900/95 border border-gray-700 text-white p-6 rounded-xl shadow-2xl transition-all"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={handleAssistantToggle}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close Assistant"
                    >
                        <X size={24} />
                    </button>

                    {/* Assistant interface */}
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            'flex-shrink-0 size-12 rounded-full flex items-center justify-center transition-all duration-300',
                            isListening
                                ? 'bg-red-500 animate-pulse'
                                : isConnected
                                    ? 'bg-green-600'
                                    : 'bg-gray-600'
                        )}>
                            <Mic size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            {/* Status indicator */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn(
                                    'w-2 h-2 rounded-full',
                                    isConnected ? 'bg-green-500' : 'bg-red-500'
                                )}></div>
                                <span className="text-xs text-gray-400">
                                    {isConnected ? (isThinking ? <span className="animate-pulse">Thinking<span className="animate-bounce">...</span></span>:"Connected") : 'Disconnected'}
                                </span>
                            </div>
                            {/* Transcript/Status */}
                            <p className="text-lg font-light text-gray-200 min-h-[28px] break-words">
                                {error
                                    ? `Error: ${error}`
                                    : transcript
                                        ? transcript
                                        : isListening
                                            ? 'Listening...'
                                            : isThinking
                                                ? (<span className="animate-pulse">Thinking<span className="animate-bounce">...</span></span>)
                                                : isConnected
                                                    ? 'Ready to listen...'
                                                    : 'Connecting...'
                                }
                            </p>
                            <div className="h-px w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-3"></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 mt-4">
                        {/* Stop Assistant Speaking */}
                        <button
                            onClick={handleSpeechStop}
                            disabled={!window.speechSynthesis.speaking}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors",
                                window.speechSynthesis.speaking
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-gray-700 cursor-not-allowed opacity-70",
                                "text-white"
                            )}
                        >
                            <X size={16} /> Stop Speaking
                        </button>
                        {/* Manual Mic Start/Stop */}
                        <button
                            onClick={isListening ? handleMicStop : handleMicStart}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors",
                                isListening
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-indigo-600 hover:bg-indigo-700",
                                "text-white"
                            )}
                        >
                            {isListening ? (
                                <>
                                    <X size={16} /> Stop Listening
                                </>
                            ) : (
                                <>
                                    <Mic size={16} /> Start Mic
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error state retry button */}
                    {error && (
                        <button
                            onClick={() => {
                                setError(null);
                                if (!isConnected) {
                                    handleAssistantToggle();
                                    setTimeout(() => handleAssistantToggle(), 100);
                                }
                            }}
                            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm transition-colors"
                        >
                            Retry Connection
                        </button>
                    )}
                </div>
            )}

            {/* Menu Overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/70 transition-all duration-150',
                    { 'opacity-0 invisible pointer-events-none': !isMenuOpen }
                )}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Menu Panel */}
            <div
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] w-[500px] max-w-[calc(100vw-3rem)] transform translate-x-full transition-transform duration-700 z-40 overflow-hidden',
                    'flex flex-col lg:justify-center py-10 gap-y-14',
                    { 'translate-x-0': isMenuOpen }
                )}
            >
                <div
                    className={cn(
                        'fixed inset-0 scale-150 translate-x-1/2 rounded-[50%] bg-gray-800 duration-700 delay-150 z-[-1]',
                        { 'translate-x-0': isMenuOpen }
                    )}
                ></div>

                <div className="grow flex md:items-center w-full max-w-[300px] mx-8 sm:mx-auto text-white">
                    <div className="flex gap-10 lg:justify-between max-lg:flex-col w-full">
                        {/* Social Links */}
                        <div className="max-lg:order-2">
                            <p className="text-gray-400 mb-5 md:mb-8">SOCIAL</p>
                            <ul className="space-y-3">
                                {SOCIAL_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg capitalize hover:underline transition-all hover:text-gray-300"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Menu Links */}
                        <div>
                            <p className="text-gray-400 mb-5 md:mb-8">MENU</p>
                            <ul className="space-y-3">
                                {MENU_LINKS.map((link, idx) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() => handleMenuClick(link.url)}
                                            className="group text-xl flex items-center gap-3 hover:text-gray-300 transition-colors"
                                        >
                                            <span className={cn(
                                                'size-3.5 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-[200%] transition-all duration-300',
                                                COLORS[idx]
                                            )}>
                                                <MoveUpRight size={8} className="scale-0 group-hover:scale-100 transition-all duration-200" />
                                            </span>
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Contact Info */}
                <div className="w-full max-w-[300px] mx-8 sm:mx-auto text-white">
                    <p className="text-gray-400 mb-4">GET IN TOUCH</p>
                    <a
                        href={`mailto:${GENERAL_INFO.email}`}
                        className="hover:underline transition-all hover:text-gray-300"
                    >
                        {GENERAL_INFO.email}
                    </a>
                </div>
            </div>
        </>
    );
};

export default Navbar;
