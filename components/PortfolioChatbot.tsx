'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: "Hi there! I'm Muneeb's AI assistant. I can walk you through his work, skills, services, or process. What are you curious about?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await response.json();

      if (data.response) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
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

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #f6d58c, #c9943c)',
          boxShadow: '0 8px 32px rgba(244, 201, 120, 0.35)',
        }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="#161108" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="#161108" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-20 right-5 z-50 w-80 max-w-[90vw] flex flex-col overflow-hidden"
          style={{
            borderRadius: '1.35rem',
            border: '1px solid rgba(255, 249, 239, 0.12)',
            background: 'linear-gradient(145deg, rgba(255, 249, 239, 0.1), rgba(255, 249, 239, 0.03)), rgba(24, 22, 18, 0.72)',
            boxShadow: '0 28px 90px rgba(0, 0, 0, 0.38)',
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{
              borderBottom: '1px solid rgba(255, 249, 239, 0.12)',
              background: 'rgba(8, 7, 6, 0.55)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #f6d58c, #c9943c)',
                color: '#161108',
              }}
            >
              M
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#fff9ef' }}>Muneeb&apos;s Assistant</p>
              <p className="text-xs" style={{ color: 'rgba(255, 249, 239, 0.46)' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#83d49b', marginRight: '6px', verticalAlign: 'middle' }}></span>
                Online
              </p>
            </div>
            <a
              href="https://calendly.com/muneeburehman1st/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: '#f4c978' }}
            >
              📅 Book call
            </a>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80" style={{ background: 'rgba(8, 7, 6, 0.42)' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] px-4 py-2.5 text-sm"
                  style={{
                    borderRadius: m.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #f6d58c, #c9943c)'
                      : 'rgba(255, 249, 239, 0.06)',
                    border: m.role === 'user' ? 'none' : '1px solid rgba(255, 249, 239, 0.12)',
                    color: m.role === 'user' ? '#161108' : '#fff9ef',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-2.5 rounded-2xl rounded-bl-md text-sm flex items-center gap-2"
                  style={{ background: 'rgba(255, 249, 239, 0.06)', color: 'rgba(255, 249, 239, 0.46)' }}
                >
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                  Thinking...
                </div>
              </div>
            )}

            {error && (
              <div
                className="p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              >
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 flex gap-2"
            style={{ borderTop: '1px solid rgba(255, 249, 239, 0.12)', background: 'rgba(8, 7, 6, 0.55)' }}
          >
            <textarea
              className="flex-1 px-4 py-2.5 text-sm rounded-2xl transition-all focus:outline-none focus:ring-2 resize-none"
              rows={1}
              style={{
                border: '1px solid rgba(255, 249, 239, 0.12)',
                background: 'rgba(0, 0, 0, 0.24)',
                color: '#fff9ef',
                minHeight: '42px',
                maxHeight: '100px',
              }}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form');
                  if (form) form.requestSubmit();
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #f6d58c, #c9943c)',
                color: '#161108',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}