"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { TypingAnimation } from "@/components/ui/typing-animation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function GlassDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <div className="glass-dot" />
      <div className="glass-dot" />
      <div className="glass-dot" />
    </div>
  );
}

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ ...props }) => <h1 className="text-white font-bold text-xl mb-2" {...props} />,
  h2: ({ ...props }) => <h2 className="text-white font-bold text-lg mb-2" {...props} />,
  h3: ({ ...props }) => <h3 className="text-white font-semibold text-base mb-1" {...props} />,
  h4: ({ ...props }) => <h4 className="text-white font-semibold text-sm mb-1" {...props} />,
  p: ({ ...props }) => <p className="text-white/80 mb-2 last:mb-0" {...props} />,
  strong: ({ ...props }) => <strong className="text-white font-semibold" {...props} />,
  code: (props) => {
    const { className, children, ...rest } = props as {
      className?: string;
      children?: React.ReactNode;
    };
    const isInline = !className;
    return isInline ? (
      <code
        className="bg-white/[0.08] px-1.5 py-0.5 rounded text-blue-300/90 text-xs"
        {...rest}
      >
        {children}
      </code>
    ) : (
      <code
        className="block bg-black/30 rounded-lg p-3 my-2 text-white/70 text-xs overflow-x-auto"
        {...rest}
      >
        {children}
      </code>
    );
  },
  a: ({ ...props }) => (
    <a className="text-blue-400/90 hover:text-blue-300 underline underline-offset-2 transition-colors" {...props} />
  ),
  ul: ({ ...props }) => <ul className="list-disc list-inside my-2 text-white/80 space-y-1" {...props} />,
  ol: ({ ...props }) => <ol className="list-decimal list-inside my-2 text-white/80 space-y-1" {...props} />,
  li: ({ ...props }) => <li className="text-white/80" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-2 border-cyan-400/40 pl-4 py-1 my-2 text-white/60 italic"
      {...props}
    />
  ),
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const loadSuggestions = async () => {
    try {
      const response = await fetch("/api/chat?action=suggestions");
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch {
      // silently fail
    }
  };

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatHistory: messages.map(({ role, content }) => ({ role, content })),
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          timestamp: new Date(data.timestamp),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error processing your message. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel relative flex flex-col h-[600px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden"
    >
      {/* Ambient top highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 glass-divider border-b">
        <div className="relative flex-shrink-0">
          <Image src="/favicon.ico" alt="Chris" width={28} height={28} className="rounded-full" unoptimized />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black/40"
            style={{ background: "rgba(37,99,235,0.9)", boxShadow: "0 0 6px rgba(37,99,235,0.6)" }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-heading font-bold text-white/90 leading-none">Portfolio Assistant</p>
          <p className="text-xs text-white/35 mt-0.5 font-body">Ask me anything about Chris</p>
        </div>
      </div>

      {/* Messages */}
      <div className="scroll-fade-container flex-1 min-h-0">
        <div
          ref={scrollRef}
          className="glass-scroll h-full overflow-y-auto px-4 py-4"
        >
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5 pt-8"
              >
                <div className="text-center text-white/40 text-sm font-body">
                  <TypingAnimation
                    words={[
                      "Ask me anything...",
                      "What would you like to know?",
                      "Curious about my experience?",
                    ]}
                    typeSpeed={50}
                    deleteSpeed={30}
                    pauseDelay={2200}
                    loop={true}
                    showCursor={true}
                    blinkCursor={true}
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="w-full space-y-2">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 + 0.1, duration: 0.35, ease: "easeOut" }}
                        onClick={() => sendMessage(s)}
                        className="glass-suggestion w-full text-left px-4 py-2.5 rounded-xl text-xs text-white/55 hover:text-white/80 font-body"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-6 h-6 mt-1">
                        <Image src="/favicon.ico" alt="Chris" width={24} height={24} className="rounded-full" unoptimized />
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "glass-bubble-user rounded-tr-sm"
                          : "glass-bubble-assistant rounded-tl-sm"
                      }`}
                    >
                      <div className="text-xs font-body prose-sm max-w-none">
                        {message.role === "assistant" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <p className="text-white/85 whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <p className="text-[10px] mt-1.5 text-white/25 font-body">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center">
                        <span className="text-[9px] text-white/50 font-heading font-bold">YOU</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-2.5 justify-start"
                  >
                    <div className="flex-shrink-0 w-6 h-6 mt-1">
                      <Image src="/favicon.ico" alt="Chris" width={24} height={24} className="rounded-full" unoptimized />
                    </div>
                    <div className="glass-bubble-assistant px-4 py-3 rounded-2xl rounded-tl-sm">
                      <GlassDots />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input area */}
      <div className="px-4 py-3 glass-divider border-t">
        <motion.form
          animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            placeholder="Ask something..."
            className="glass-input flex-1 rounded-xl px-4 py-2.5 text-xs text-white/80 placeholder:text-white/25 font-body disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="glass-send-btn w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-blue-300/80" />
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
