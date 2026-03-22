import ReactMarkdown from "react-markdown";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 animate-msg-in max-w-3xl", isUser && "flex-row-reverse self-end")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 mt-0.5",
          isUser ? "bg-surface2 border border-border" : "bg-lime"
        )}
      >
        {isUser ? "👤" : "💪"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "px-4 py-3.5 rounded-2xl border text-sm leading-relaxed",
          isUser
            ? "bg-[#1e2a00] border-lime/20 text-white"
            : "bg-surface2 border-border text-white prose-chat"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p>{children}</p>,
              strong: ({ children }) => <strong className="text-lime font-semibold">{children}</strong>,
              h1: ({ children }) => <h3 className="font-barlow text-lg font-bold text-lime tracking-wide mt-3 mb-1 first:mt-0">{children}</h3>,
              h2: ({ children }) => <h3 className="font-barlow text-lg font-bold text-lime tracking-wide mt-3 mb-1 first:mt-0">{children}</h3>,
              h3: ({ children }) => <h3 className="font-barlow text-lg font-bold text-lime tracking-wide mt-3 mb-1 first:mt-0">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm">{children}</li>,
              code: ({ children }) => (
                <code className="bg-surface border border-border rounded px-1.5 py-0.5 text-xs font-mono">{children}</code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
