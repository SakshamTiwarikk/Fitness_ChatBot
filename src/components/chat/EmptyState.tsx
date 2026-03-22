"use client";

const STARTER_PROMPTS = [
  { emoji: "🌱", text: "I'm a total beginner — where do I start?" },
  { emoji: "📅", text: "How often should I work out?" },
  { emoji: "💪", text: "Best exercises for building muscle" },
  { emoji: "🥩", text: "How much protein do I need?" },
];

interface EmptyStateProps {
  onPrompt: (prompt: string) => void;
}

export function EmptyState({ onPrompt }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
      <div className="text-6xl mb-5">🏋️‍♂️</div>
      <h2 className="font-barlow text-4xl font-black tracking-wider mb-2">
        YOUR COACH IS{" "}
        <span className="text-lime">READY.</span>
      </h2>
      <p className="text-muted text-sm max-w-sm leading-relaxed mb-8">
        Ask me anything about gym plans, diet, or staying motivated. Built for complete beginners — no judgment, just gains.
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
        {STARTER_PROMPTS.map((p) => (
          <button
            key={p.text}
            onClick={() => onPrompt(p.text)}
            className="bg-surface2 border border-border rounded-xl px-4 py-3.5 text-left hover:border-lime hover:bg-lime/10 transition-all group"
          >
            <span className="block text-xl mb-1.5">{p.emoji}</span>
            <span className="text-sm text-white group-hover:text-lime transition-colors leading-snug">
              {p.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
