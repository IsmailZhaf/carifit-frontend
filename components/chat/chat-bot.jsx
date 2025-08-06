"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function ChatBot({ jobTitle, jobDescription, companyName, initialSuggestedQuestions, jobId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState(
        initialSuggestedQuestions || [
            { id: "1", text: "What skills are required for this job?" },
            { id: "2", text: "What is the expected experience level?" },
            { id: "3", text: "Is remote work available for this position?" },
            { id: "4", text: "What are the main responsibilities?" },
        ]
    );

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const wsRef = useRef(null); // ref untuk WebSocket
    const job_id = jobId;

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isOpen]);

    // Setup WebSocket connection when chat opens
    useEffect(() => {
        if (!isOpen) return;

        const token = localStorage.getItem("access");
        console.log("Connecting WebSocket with token:", token);
        const socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_WS_API_URL}/ws/chat/${jobId}/?token=${token}`);

        wsRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.error) {
                console.error("WebSocket error from server:", data.error);
                setIsTyping(false);
                return;
            }

            if (data.message === "Authenticated") {
                console.log("User authenticated via WebSocket");
                return;
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    content: data.message,
                    role: "assistant",
                    timestamp: new Date(),
                },
            ]);
            setIsTyping(false);
        };

        socket.onerror = (e) => {
            console.error("WebSocket error:", e);
            setIsTyping(false);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => socket.close();
    }, [isOpen, jobId]);

    // Send message via WebSocket
    const handleSendMessage = (content) => {
        if (!content.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const userMessage = {
            id: Date.now().toString(),
            content,
            role: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        wsRef.current.send(JSON.stringify({ message: content }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    // Tampilkan welcome message saat chat dibuka pertama kali
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    content: `Hai! Saya adalah Asisten CariFit untuk posisi ${jobTitle} di ${companyName}. Ada yang bisa saya bantu terkait lamaran kerja Anda?`,
                    role: "assistant",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen, jobTitle, companyName]);

    return (
        <div className="fixed bottom-3 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] sm:w-[400px] md:w-[600px] lg:w-[700px] mx-auto bg-background border rounded-lg shadow-lg flex flex-col overflow-hidden"
                        style={{
                            height: "calc(100dvh - 120px)", // ❗ support mobile viewport height dengan keyboard terbuka
                            maxHeight: "calc(100dvh - 120px)",
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 bg-primary">
                                    <div className="text-xs font-semibold">AI</div>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">CariFit Assistant</h3>
                                    <p className="text-xs text-muted-foreground">Tanyakan tentang persyaratan pekerjaan</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Chat messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                                    <div className={cn("max-w-[80%] rounded-lg p-3", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        {message.role === "user" ? (
                                            <>
                                                <p className="text-sm">{message.content}</p>
                                                <p className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-sm">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                                <p className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested questions */}
                        {suggestedQuestions.length > 0 && (
                            <div className="p-2 border-t bg-muted/30">
                                <p className="text-xs text-muted-foreground mb-2 px-2">Pertanyaan yang disarankan:</p>
                                <div className="flex flex-wrap gap-2 px-2">
                                    {suggestedQuestions.map((question) => (
                                        <Badge key={question.id} variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5" onClick={() => handleSendMessage(question.text)}>
                                            {question.text}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat input */}
                        <div className="p-4 border-t">
                            <div className="flex items-center gap-2">
                                <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Tulis pertanyaan Anda..." className="flex-1" />
                                <Button size="icon" onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim() || isTyping}>
                                    {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat toggle button */}
            <motion.button
                className={cn("flex items-center gap-2 rounded-full shadow-lg p-4 text-white transition-colors", isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary-dark")}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                <span className="hidden sm:inline-block font-semibold">CariFit Assistant</span>
            </motion.button>
        </div>
    );
}

// Helper untuk format waktu HH:mm
function formatTime(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
