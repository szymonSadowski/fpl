import { useRef, useEffect, useState, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { TextStreamChatTransport, isTextUIPart, type UIMessage } from 'ai';
import { X, Send, Sparkles } from 'lucide-react';

type Props = {
  teamId: number;
  onClose: () => void;
};

const SUGGESTED_PROMPTS = [
  'Who should I captain this week?',
  'What transfers should I make?',
  'Should I use a chip this GW?',
  'Who are the best differential picks?',
];

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join('');
}

export function AiChatPanel({ teamId, onClose }: Props) {
  const [input, setInput] = useState('');
  const transport = useMemo(
    () => new TextStreamChatTransport({ api: `/api/ai/chat/${teamId}` }),
    [teamId],
  );
  const { messages, sendMessage, status } = useChat({ transport });
  const isLoading = status === 'submitted' || status === 'streaming';

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] flex flex-col bg-bg-card/95 backdrop-blur-xl border-l border-border/80 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fpl-gold" />
          <span className="text-sm font-semibold text-text-primary">FPL AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-fpl-gold/60 focus-visible:outline-none rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-secondary">Ask me anything about your squad:</p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => submit(prompt)}
                className="block w-full text-left text-xs px-3 py-2 rounded border border-border/50 text-text-secondary hover:border-fpl-gold/40 hover:text-text-primary hover:bg-fpl-gold/5 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((m: UIMessage) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-fpl-gold/20 border border-fpl-gold/30 text-text-primary'
                  : 'bg-bg-dark/60 border border-border/40 text-text-primary prose prose-invert [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:text-sm [&_p]:my-0.5 [&_li]:text-sm [&_li]:my-0.5 [&_ul]:pl-4 [&_ol]:pl-4 [&_strong]:text-white [&_*]:text-text-primary'
              }`}
            >
              {m.role === 'user' ? getMessageText(m) : <ReactMarkdown>{getMessageText(m)}</ReactMarkdown>}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-dark/60 border border-border/40 rounded-lg px-3 py-2 text-xs text-fpl-gold animate-pulse">
              ▋
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(input); }}
        className="flex items-center gap-2 px-4 py-3 border-t border-border/50"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your squad..."
          name="chat-message"
          autoComplete="off"
          className="flex-1 bg-bg-dark/50 border border-border/50 rounded px-3 py-2 text-xs text-text-primary placeholder-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fpl-gold/50 focus-visible:border-fpl-gold/50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="p-2 text-fpl-gold disabled:opacity-40 hover:bg-fpl-gold/10 rounded transition-colors focus-visible:ring-2 focus-visible:ring-fpl-gold/60 focus-visible:outline-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
