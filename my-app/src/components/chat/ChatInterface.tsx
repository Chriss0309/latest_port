"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const dotClass =
  "w-1.5 h-1.5 rounded-full bg-neutral-400 animate-[chat-pulse_1.4s_ease-in-out_infinite]";

function LoaderDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <div className={dotClass} />
      <div className={`${dotClass} [animation-delay:0.2s]`} />
      <div className={`${dotClass} [animation-delay:0.4s]`} />
    </div>
  );
}

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ ...props }) => <h1 className="text-foreground font-sans font-medium text-lg mb-2" {...props} />,
  h2: ({ ...props }) => <h2 className="text-foreground font-sans font-medium text-base mb-2" {...props} />,
  h3: ({ ...props }) => <h3 className="text-foreground font-sans font-medium text-sm mb-1" {...props} />,
  h4: ({ ...props }) => <h4 className="text-foreground font-sans font-medium text-sm mb-1" {...props} />,
  p: ({ ...props }) => <p className="text-foreground/80 mb-2 last:mb-0" {...props} />,
  strong: ({ ...props }) => <strong className="text-foreground font-medium" {...props} />,
  code: (props) => {
    const { className, children, ...rest } = props as {
      className?: string;
      children?: React.ReactNode;
    };
    const isInline = !className;
    return isInline ? (
      <code
        className="bg-white border border-border rounded px-1.5 py-0.5 text-[12px] font-mono text-foreground"
        {...rest}
      >
        {children}
      </code>
    ) : (
      <code
        className="block bg-white border border-border rounded-lg p-3 my-2 font-mono text-[12px] text-foreground/80 overflow-x-auto"
        {...rest}
      >
        {children}
      </code>
    );
  },
  a: ({ ...props }) => (
    <a className="text-blue-700 underline underline-offset-2" {...props} />
  ),
  ul: ({ ...props }) => <ul className="list-disc list-inside my-2 text-foreground/80 space-y-1" {...props} />,
  ol: ({ ...props }) => <ol className="list-decimal list-inside my-2 text-foreground/80 space-y-1" {...props} />,
  li: ({ ...props }) => <li className="text-foreground/80" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-2 border-neutral-300 pl-4 py-1 my-2 text-foreground/60 italic"
      {...props}
    />
  ),
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-[70vh] w-full flex-col overflow-hidden rounded-xl border border-border bg-card lg:h-full"
    >
      <div className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">
        Ask me anything
      </div>

      <div ref={scrollRef} className="chat-scroll min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col justify-end"
            >
              {suggestions.length > 0 && (
                <>
                  <p className="px-2.5 pb-1.5 text-xs text-muted-foreground">Try asking</p>
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                      onClick={() => sendMessage(s)}
                      className="w-full rounded-md px-2.5 py-2 text-left text-sm text-foreground/75 transition-colors hover:bg-neutral-100 hover:text-foreground"
                    >
                      {s}
                    </motion.button>
                  ))}
                </>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4 px-1">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    message.role === "user"
                      ? "max-w-[85%] self-end whitespace-pre-wrap rounded-2xl bg-neutral-100 px-3.5 py-2 text-sm text-foreground"
                      : "text-sm leading-relaxed text-foreground/85"
                  }
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <LoaderDots />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="px-3 pb-3 pt-1"
      >
        <div className="rounded-xl border border-border bg-white shadow-[0_1px_2px_rgba(28,22,18,0.04),0_4px_12px_rgba(28,22,18,0.05)] transition-colors focus-within:border-neutral-400">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask something..."
            className="w-full bg-transparent px-3.5 pb-1 pt-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          />
          <div className="flex justify-end px-2 pb-2">
            <button
              type="submit"
              aria-label="Send"
              disabled={isLoading || !input.trim()}
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
