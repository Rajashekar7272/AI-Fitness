// File: /pages/api/gemini.ts or /app/api/gemini/route.ts (if using App Router)
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 8000,
        },
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    return NextResponse.json({ result: null }, { status: 500 });
  }
}
