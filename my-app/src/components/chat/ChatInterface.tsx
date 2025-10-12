"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TypingAnimation } from "@/components/ui/typing-animation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load suggested questions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const response = await fetch("/api/chat?action=suggestions");
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Add user message
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          chatHistory: messages.map(({ role, content }) => ({ role, content })),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(data.timestamp),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto rounded-2xl shadow-2xl relative overflow-hidden group">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />
      
      {/* Border with gradient */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]" />
      
      {/* Inner glow */}
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      
      <div className="relative flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-heading font-bold flex items-center gap-2 text-white">
            <img src="/favicon.ico" alt="Chris" className="w-6 h-6" />
            Portfolio Assistant
          </h3>
          <p className="text-sm text-gray-400 font-body">
            Ask me anything about my experience, projects, or skills!
          </p>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 relative" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-gray-400">
              <TypingAnimation 
                words={[
                  "Start a conversation by asking a question...",
                  "What would you like to know about me?",
                  "Ask about my experience, projects, or skills!"
                ]}
                typeSpeed={50}
                deleteSpeed={30}
                pauseDelay={2000}
                loop={true}
                showCursor={true}
                blinkCursor={true}
              />
            </div>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left p-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all text-sm text-gray-300 hover:text-white shadow-lg hover:shadow-xl hover:border-white/30"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/favicon.ico" alt="Chris" className="w-8 h-8" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 backdrop-blur-sm border shadow-lg bg-white/10 text-gray-100 border-white/20`}
                >
                  <div className="text-sm prose prose-sm max-w-none prose-invert prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-li:text-gray-200 prose-code:text-blue-300">
                    {message.role === "assistant" ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Style headings
                          h1: ({node, ...props}) => (
                            <h1 className="text-white font-bold text-xl mb-2" {...props} />
                          ),
                          h2: ({node, ...props}) => (
                            <h2 className="text-white font-bold text-lg mb-2" {...props} />
                          ),
                          h3: ({node, ...props}) => (
                            <h3 className="text-white font-semibold text-base mb-1" {...props} />
                          ),
                          h4: ({node, ...props}) => (
                            <h4 className="text-white font-semibold text-sm mb-1" {...props} />
                          ),
                          // Style paragraphs
                          p: ({node, ...props}) => (
                            <p className="text-gray-200 mb-2" {...props} />
                          ),
                          // Style strong/bold text
                          strong: ({node, ...props}) => (
                            <strong className="text-white font-bold" {...props} />
                          ),
                          // Style code blocks
                          code: (props) => {
                            const {className, children, ...rest} = props as { className?: string; children?: React.ReactNode };
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 text-xs" {...rest}>
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-white/5 p-2 rounded my-2 text-gray-200 text-xs overflow-x-auto" {...rest}>
                                {children}
                              </code>
                            );
                          },
                          // Style links
                          a: ({node, ...props}) => (
                            <a className="text-blue-400 hover:text-blue-300 hover:underline" {...props} />
                          ),
                          // Style lists
                          ul: ({node, ...props}) => (
                            <ul className="list-disc list-inside my-2 text-gray-200 space-y-1" {...props} />
                          ),
                          ol: ({node, ...props}) => (
                            <ol className="list-decimal list-inside my-2 text-gray-200 space-y-1" {...props} />
                          ),
                          li: ({node, ...props}) => (
                            <li className="text-gray-200" {...props} />
                          ),
                          // Style blockquotes
                          blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-2 text-gray-300 italic" {...props} />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap text-white">{message.content}</p>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/favicon.ico" alt="Chris" className="w-8 h-8" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 shadow-lg">
                  <div className="text-gray-300 text-sm flex items-center gap-2">
                    <TypingAnimation 
                      words={["Thinking...", "Processing...", "Analyzing..."]}
                      typeSpeed={60}
                      deleteSpeed={40}
                      pauseDelay={800}
                      loop={true}
                      showCursor={false}
                      className="inline-block"
                    />
                    <Loader2 className="w-3 h-3 animate-spin text-gray-400 ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="What would you like to know about me?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-blue-400 focus-visible:ring-1 focus-visible:border-blue-400/50 backdrop-blur-sm transition-all"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              size="icon" 
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 border border-white/10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
