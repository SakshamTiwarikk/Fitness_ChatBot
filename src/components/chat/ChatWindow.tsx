"use client";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types";

interface ChatWindowProps {
  sessionId: string;
  initialMessages?: Message[];
  pendingPrompt?: string;
  onPromptConsumed?: () => void;
}

export function ChatWindow({ sessionId, initialMessages = [], pendingPrompt, onPromptConsumed }: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage, clearError } = useChat({ sessionId, initialMessages });
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Trigger pending prompt from sidebar
  useEffect(() => {
    if (pendingPrompt) {
      setInputValue(pendingPrompt);
      onPromptConsumed?.();
    }
  }, [pendingPrompt]);

  const handleSend = (msg: string) => {
    clearError();
    sendMessage(msg);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center text-xl flex-shrink-0">💪</div>
        <div>
          <div className="font-barlow text-xl font-extrabold tracking-wide">COACH FORM</div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block animate-pulse" />
            AI-powered · Beginner friendly
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {messages.length === 0 ? (
          <EmptyState onPrompt={handleSend} />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                ⚠️ {error}
                <button onClick={clearError} className="ml-auto text-red-400/60 hover:text-red-400 text-lg leading-none">×</button>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        initialValue={inputValue}
        onInitialValueConsumed={() => setInputValue("")}
      />
    </div>
  );
}
