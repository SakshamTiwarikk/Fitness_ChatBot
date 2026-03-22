"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ChatSession } from "@/types";

const QUICK_PROMPTS = [
  { icon: "🏋️", label: "3-Day Gym Plan", prompt: "Give me a 3-day beginner gym plan for the week" },
  { icon: "🥗", label: "Diet Plan", prompt: "Create a beginner-friendly diet plan for muscle building" },
  { icon: "🏠", label: "Home Workout", prompt: "I have no equipment. Give me a home workout plan" },
  { icon: "🔥", label: "Stay Motivated", prompt: "How do I stay motivated when I want to skip the gym?" },
  { icon: "⚡", label: "Pre/Post Meal", prompt: "What should I eat before and after a workout?" },
];

interface SidebarProps {
  currentSessionId: string;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onQuickPrompt: (prompt: string) => void;
}

export function Sidebar({ currentSessionId, onNewSession, onSelectSession, onQuickPrompt }: SidebarProps) {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []));
  }, [currentSessionId]);

  return (
    <aside className="w-64 min-w-[256px] bg-surface border-r border-border flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border flex-shrink-0">
        <div className="font-barlow text-3xl font-black tracking-widest text-lime leading-none">FORM</div>
        <div className="text-muted text-[10px] tracking-widest uppercase mt-0.5">AI Fitness Coach</div>
      </div>

      {/* New Session */}
      <div className="px-4 pt-4 flex-shrink-0">
        <button
          onClick={onNewSession}
          className="w-full bg-lime text-black font-barlow font-bold text-sm tracking-wider py-2.5 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
        >
          + NEW SESSION
        </button>
      </div>

      {/* Quick Programs */}
      <div className="px-4 pt-5 flex-shrink-0">
        <div className="text-[10px] text-muted uppercase tracking-widest mb-2">Quick Programs</div>
        <div className="space-y-1">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q.label}
              onClick={() => onQuickPrompt(q.prompt)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface2 border border-border hover:border-lime hover:bg-lime/10 transition-all text-left group"
            >
              <span className="text-base">{q.icon}</span>
              <span className="text-xs text-white group-hover:text-lime transition-colors font-medium">{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="px-4 pt-5 flex-1 min-h-0 overflow-y-auto">
        <div className="text-[10px] text-muted uppercase tracking-widest mb-2">History</div>
        {sessions.length === 0 ? (
          <p className="text-muted text-xs">No sessions yet</p>
        ) : (
          <div className="space-y-1">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all truncate ${
                  s.id === currentSessionId
                    ? "bg-lime/10 border border-lime/30 text-lime"
                    : "text-muted hover:text-white hover:bg-surface2 border border-transparent"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{session?.user?.name ?? "User"}</div>
            <div className="text-[10px] text-muted truncate">{session?.user?.email}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-muted hover:text-white transition-colors text-xs flex-shrink-0"
            title="Sign out"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  );
}
