/**
 * Typelite AI Proxy — Cloudflare Worker
 *
 * Uses Cloudflare Workers AI (free) to generate character backstories and reports.
 * No API key needed — uses the built-in AI binding.
 *
 * Deploy:
 *   cd proxy && npx wrangler deploy
 *
 * Local dev:
 *   cd proxy && npx wrangler dev
 */

import TYPOLOGY_REFERENCE from "./typology-reference.md";

interface Env {
  AI: Ai;
  ALLOWED_ORIGIN?: string;
  RATE_LIMIT_PER_MINUTE?: string;
}

// ============================================================
// SYSTEM PROMPTS
// ============================================================

const BACKSTORY_PROMPT = `You are a dark fantasy narrator writing character backstories for a roguelite game called Typelite. Write in a vivid, atmospheric style — think Darkest Dungeon meets classic fantasy.

Rules:
- Write exactly 2-3 paragraphs
- Reference the character's specific class, abilities, element, and combat style naturally
- Weave in personality traits implied by their stats (high willpower = determined, high intelligence = cunning, etc.)
- Include a defining moment or origin event
- End with a hint of their current quest or motivation
- Do NOT use the character's exact stat numbers — translate them into narrative
- Keep it under 200 words
- No headers, no bullet points — pure narrative prose`;

const REPORT_PROMPT = `You are an expert in personality typology writing cross-system analyses. Your audience knows the systems — you don't need to explain basics. Focus on how the specific types interact to create a real person with inner conflicts, contradictions, and emergent strengths.

Use the typology reference provided in the user message for factual accuracy.

Structure your analysis around the PERSON, not the systems. Organize by themes like:
- Where this combination creates inner conflict (e.g., a drive for peace undermined by chronic self-doubt about direction)
- Where the types reinforce each other into a core strength (e.g., analytical confidence from multiple systems converging on logic)
- What contradictions this person lives with that wouldn't exist if you changed one type
- How growth or stress in one system ripples through the others

You can mention individual types to set context, but always connect them — show how one type colors, amplifies, or undercuts another. Don't just list what each type does separately.

FORMATTING RULES — follow exactly:
- Plain text only. No markdown, no bold, no headers, no bullet points, no asterisks, no numbered lists.
- Write in flowing paragraphs. Use line breaks between paragraphs only.
- Open with a brief sentence naming the type combination, then go straight into analysis.
- 4-5 paragraphs, ~400 words.
- Use precise notation inline: 3rd Volition, Ti-Hero, Ne-Parent, 9w1, sp, Alpha quadra, SUR center, etc.
- You may reference game character elements briefly where they illustrate a typological point, but the focus is the person's psychology, not their stats or abilities.

CRITICAL: Your output must contain zero markdown. No ** for bold, no ## for headers, no * for bullets. Just plain sentences in paragraphs.`;

type RequestMode = "backstory" | "report";

const PROMPTS: Record<
  RequestMode,
  { system: string; user: (summary: string) => string }
> = {
  backstory: {
    system: BACKSTORY_PROMPT,
    user: (s) => `Write a backstory for this character:\n\n${s}`,
  },
  report: {
    system: REPORT_PROMPT,
    user: (s) =>
      `Typology reference for factual accuracy (do not contradict this):\n\n${TYPOLOGY_REFERENCE}\n\n---\n\nAnalyze this person's type combination. Focus on inner conflicts, core strengths, and how the systems shape each other. Write in plain text — no markdown formatting.\n\n${s}`,
  },
};

// ============================================================
// RATE LIMITING (in-memory, resets on worker restart)
// ============================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= maxPerMinute) {
    return false;
  }

  entry.count++;
  return true;
}

// ============================================================
// HANDLER
// ============================================================

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = env.ALLOWED_ORIGIN ?? "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting
    const ip =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for") ??
      "unknown";
    const maxPerMinute = parseInt(env.RATE_LIMIT_PER_MINUTE ?? "10", 10);

    if (!checkRateLimit(ip, maxPerMinute)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Try again in a minute.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse request
    let characterSummary: string;
    let mode: RequestMode;
    try {
      const body = (await request.json()) as {
        characterSummary?: string;
        mode?: string;
      };
      if (!body.characterSummary || typeof body.characterSummary !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing characterSummary in request body" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      characterSummary = body.characterSummary;
      mode = body.mode === "report" ? "report" : "backstory";
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Workers AI
    const prompt = PROMPTS[mode];
    try {
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user(characterSummary) },
        ],
        max_tokens: mode === "report" ? 1024 : 512,
      });

      const text = result.response ?? "";
      const responseKey = mode === "report" ? "report" : "backstory";

      return new Response(JSON.stringify({ [responseKey]: text }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Workers AI error:", err);
      return new Response(
        JSON.stringify({ error: "Generation failed. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  },
};
