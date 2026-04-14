import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Strip markdown code fences if present
    const clean = text.replace(/```json\n?|```\n?/g, "").trim();
    const parsed = JSON.parse(clean);

    // Add IDs and completion status to sessions
    if (parsed.weeks) {
      parsed.weeks = parsed.weeks.map((week: { weekNumber: number; theme: string; sessions: { id?: string; day: string; title: string; description: string; targetMetric: string; targetValue: number; unit: string; type: string; completed?: boolean }[] }) => ({
        ...week,
        sessions: week.sessions.map((session, idx: number) => ({
          ...session,
          id: session.id || `w${week.weekNumber}s${idx + 1}`,
          completed: false,
        })),
      }));
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Plan generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
