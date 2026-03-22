export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-9 h-9 rounded-full bg-lime flex items-center justify-center text-base flex-shrink-0">
        💪
      </div>
      <div className="bg-surface2 border border-border rounded-2xl px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-muted rounded-full animate-dot1 inline-block" />
        <span className="w-2 h-2 bg-muted rounded-full animate-dot2 inline-block" />
        <span className="w-2 h-2 bg-muted rounded-full animate-dot3 inline-block" />
      </div>
    </div>
  );
}
