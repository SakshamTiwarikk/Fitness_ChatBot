"use client";
import { useState, useCallback, useRef } from "react";
import type { Message } from "@/types";

interface UseChatOptions {
  sessionId: string;
  initialMessages?: Message[];
}

export function useChat({ sessionId, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      setError(null);

      const optimisticUserMsg: Message = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        user_id: "",
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticUserMsg]);
      setIsLoading(true);

      abortRef.current = new AbortController();

      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, session_id: sessionId, history }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Something went wrong");
        }

        const data = await res.json();

        const assistantMsg: Message = {
          id: data.message_id ?? crypto.randomUUID(),
          session_id: sessionId,
          user_id: "",
          role: "assistant",
          content: data.reply,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        if ((err as Error).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Failed to send message";
        setError(msg);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMsg.id));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, sessionId, isLoading]
  );

  const clearError = () => setError(null);

  return { messages, isLoading, error, sendMessage, clearError };
}
