"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Message } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Create or load a session on mount
  useEffect(() => {
    if (status === "authenticated") initSession();
  }, [status]);

  const initSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      const sessions = data.sessions ?? [];

      if (sessions.length > 0) {
        // Load most recent session
        await loadSession(sessions[0].id);
      } else {
        // Create first session
        await createNewSession();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    const res = await fetch("/api/sessions", { method: "POST" });
    const data = await res.json();
    setCurrentSessionId(data.session.id);
    setSessionMessages([]);
  };

  const loadSession = async (id: string) => {
    setCurrentSessionId(id);
    const res = await fetch(`/api/sessions/${id}/messages`);
    const data = await res.json();
    setSessionMessages(data.messages ?? []);
  };

  const handleQuickPrompt = async (prompt: string) => {
    // Always start fresh session for quick prompts
    await createNewSession();
    setPendingPrompt(prompt);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="font-barlow text-4xl font-black tracking-widest text-lime mb-2">FORM</div>
          <div className="text-muted text-sm">Loading your session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          currentSessionId={currentSessionId}
          onNewSession={createNewSession}
          onSelectSession={loadSession}
          onQuickPrompt={handleQuickPrompt}
        />
      </div>

      {/* Chat */}
      <main className="flex-1 overflow-hidden">
        {currentSessionId && (
          <ChatWindow
            key={currentSessionId}
            sessionId={currentSessionId}
            initialMessages={sessionMessages}
            pendingPrompt={pendingPrompt}
            onPromptConsumed={() => setPendingPrompt(undefined)}
          />
        )}
      </main>
    </div>
  );
}
