'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, ArrowUpRight, Calendar, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  "What is Muneeb's core tech stack?",
  "Tell me about his top AI & Next.js projects",
  "Is Muneeb available for freelance/contract?",
  "How can I contact or hire him?"
];

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: "Hi there! I'm Muneeb's AI assistant. I can walk you through his full-stack work, AI agents, technical stack, or project timelines. What are you curious about?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const executeMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    counterRef.current += 1;
    const userMsgId = `user-${counterRef.current}-${userText.slice(0, 8)}`;

    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: userText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error('Could not reach the assistant service');
      }

      const data = await res.json();

      if (data.response) {
        counterRef.current += 1;
        const assistantMsgId = `assistant-${counterRef.current}`;
        setMessages(prev => [...prev, {
          id: assistantMsgId,
          role: 'assistant',
          content: data.response
        }]);
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If user presses Enter without Shift, send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeMessage(input);
    }
    // If Shift + Enter is pressed, default browser behavior inserts a new line.
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    executeMessage(input);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi there! I'm Muneeb's AI assistant. I can walk you through his full-stack work, AI agents, technical stack, or project timelines. What are you curious about?"
      }
    ]);
    setError(null);
  };

  return (
    <>
      {/* Floating Toggle Button (Visible on ALL devices: PC, Tablet & Mobile) */}
      <button
        id="portfolio-chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 p-3 sm:p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #ffd98c, #d9a03c)',
          boxShadow: '0 8px 30px rgba(255, 217, 140, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#120f0a'
        }}
        aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat Assistant'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-stone-900" />
        ) : (
          <>
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 text-stone-950" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#08090c] animate-pulse" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-stone-950 pr-1">
              Ask AI
            </span>
          </>
        )}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          id="portfolio-chatbot-modal"
          className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[390px] max-w-md h-[540px] max-h-[82vh] flex flex-col rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#161922] via-[#0f1118] to-[#0a0c10] shadow-[0_25px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd98c] to-[#c79135] flex items-center justify-center text-xs font-bold text-stone-950 flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4 text-stone-950" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs text-white truncate flex items-center gap-1.5">
                  <span>Muneeb&apos;s Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                </p>
                <p className="text-[10px] font-mono text-stone-400">
                  Ready to answer 24/7
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <a
                href="https://calendly.com/muneeburehman1st/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#ffd98c] hover:underline"
              >
                <Calendar className="w-3 h-3" />
                <span>Book Call</span>
              </a>
              <button
                onClick={handleReset}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat window"
                aria-label="Close chat"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-black/20 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#ffd98c]" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#ffd98c] to-[#f3cb7c] text-stone-950 font-medium rounded-tr-sm shadow-md'
                      : 'bg-white/[0.06] border border-white/10 text-stone-200 rounded-tl-sm'
                  }`}
                >
                  {m.content}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-stone-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 font-mono text-xs p-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-[#ffd98c] animate-spin" />
                </div>
                <span>Thinking...</span>
              </div>
            )}

            {error && (
              <div className="p-2.5 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-300">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-white/5 bg-white/[0.02]">
              <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffd98c]" /> Suggestions:
              </p>
              <div className="flex flex-col gap-1">
                {QUICK_PROMPTS.slice(0, 3).map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => executeMessage(prompt)}
                    className="text-[11px] font-mono text-stone-300 hover:text-[#ffd98c] bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-amber-400/30 px-2.5 py-1.5 rounded-lg transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">↳ {prompt}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60 flex-shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form with Shift+Enter multi-line support */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/10 bg-black/40 flex flex-col gap-1.5"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Muneeb's skills, projects... (Shift+Enter for newline)"
                disabled={isLoading}
                className="flex-1 max-h-28 min-h-[36px] bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#ffd98c]/60 disabled:opacity-50 resize-none leading-relaxed"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl bg-[#ffd98c] hover:bg-[#ffe1a6] text-stone-950 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0 mb-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 px-1">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-2.5 h-2.5" /> <strong>Enter</strong> to send
              </span>
              <span><strong>Shift+Enter</strong> for newline</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
