import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ChatRequest } from "@/types";

const SYSTEM_PROMPT = `You are FORM — a motivating, no-nonsense AI fitness coach built specifically for complete beginners.

Your personality:
- Encouraging and positive, like a patient personal trainer
- Direct and practical — no fluff, no filler
- Use simple language; explain jargon when needed
- Care about safety: always remind beginners to warm up, use proper form, and rest

Your expertise:
- Beginner gym programs (3-day, 4-day splits)
- Bodyweight and home workouts
- Basic nutrition: protein, calories, hydration, meal timing
- Muscle groups and exercise form
- Motivation, consistency, habit building
- Common beginner mistakes to avoid
- Progressive overload explained simply

Formatting:
- Use **bold** for key terms, exercise names, numbers
- Use ### for headers in longer responses
- Use bullet points for exercise lists and steps
- Keep responses focused and complete
- When giving workout plans, use Day 1, Day 2, etc. format
- Always offer to go deeper on any topic

You are here to make fitness feel achievable for anyone starting from zero.`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, session_id, history }: ChatRequest = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { data: chatSession, error: sessionError } = await supabaseAdmin
      .from("chat_sessions")
      .select("id")
      .eq("id", session_id)
      .eq("user_id", session.user.id)
      .single();

    if (sessionError || !chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const recentHistory = history.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...recentHistory,
          { role: "user", content: message },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      throw new Error(err.error?.message || `Groq API error ${groqRes.status}`);
    }

    const groqData = await groqRes.json();
    const reply =
      groqData.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    const [, assistantMsg] = await Promise.all([
      supabaseAdmin.from("messages").insert({
        session_id,
        user_id: session.user.id,
        role: "user",
        content: message,
      }),
      supabaseAdmin
        .from("messages")
        .insert({
          session_id,
          user_id: session.user.id,
          role: "assistant",
          content: reply,
        })
        .select("id")
        .single(),
    ]);

    const { data: msgCount } = await supabaseAdmin
      .from("messages")
      .select("id")
      .eq("session_id", session_id);

    if ((msgCount?.length ?? 0) <= 2) {
      const title = message.slice(0, 60) + (message.length > 60 ? "..." : "");
      await supabaseAdmin
        .from("chat_sessions")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", session_id);
    } else {
      await supabaseAdmin
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", session_id);
    }

    return NextResponse.json({
      reply,
      session_id,
      message_id: assistantMsg.data?.id,
    });
  } catch (err: unknown) {
    console.error("[CHAT ERROR]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}