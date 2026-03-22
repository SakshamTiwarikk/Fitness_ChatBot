"use client";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
  onInitialValueConsumed?: () => void;
}

export function ChatInput({ onSend, disabled, initialValue, onInitialValueConsumed }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      textareaRef.current?.focus();
      onInitialValueConsumed?.();
    }
  }, [initialValue]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    autoResize();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="px-6 pb-5 pt-4 bg-surface border-t border-border flex-shrink-0">
      <div
        className={`flex items-end gap-3 bg-surface2 border rounded-xl px-4 py-3 transition-colors ${
          disabled ? "border-border" : "border-border focus-within:border-lime"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask your coach anything..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-muted resize-none min-h-6 max-h-28 leading-relaxed disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-yellow-300 transition-all active:scale-95 disabled:bg-border disabled:cursor-not-allowed text-black font-bold"
        >
          ➤
        </button>
      </div>
      <p className="text-center text-[10px] text-muted mt-2 tracking-wide">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
