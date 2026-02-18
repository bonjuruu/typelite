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

interface Env {
  AI: Ai
  ALLOWED_ORIGIN?: string
  RATE_LIMIT_PER_MINUTE?: string
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
- No headers, no bullet points — pure narrative prose`

const REPORT_PROMPT = `You are an expert in personality typology systems writing character analyses for a roguelite game called Typelite. The game maps real typology systems to game mechanics.

The systems and their game mappings:
- Attitudinal Psyche (AP): 4 aspects (Volition→Willpower, Logic→Intelligence, Emotion→Spirit, Physics→Vitality) ranked 1st-4th. 1st position = confident/imposing, 2nd = collaborative, 3rd = insecure, 4th = deferring.
- Enneagram: 9 types with wings, instinctual variants (sp/so/sx), lines of integration (growth) and disintegration (stress). Maps to class archetype.
- MBTI (Beebe model): 4 cognitive functions in Hero/Parent/Child/Inferior slots. Maps to ability kit.
- Socionics: 16 types in 4 quadras (Alpha/Beta/Gamma/Delta). Maps to elemental affinity.
- Expanded Instincts: 9 realms across 3 centers (Self-Survival/Interpersonal/Purpose). Maps to combat behavior.

Write a flowing analysis (3-4 paragraphs, ~300 words) of how this character's typology systems interact to create a cohesive personality and playstyle. Cover:
- How the AP stack shapes their core temperament and stat distribution
- How the Enneagram type drives their motivations and class identity
- How MBTI cognitive functions influence their abilities and decision-making
- How Socionics quadra and Expanded Instincts tie their element and combat style together
- Synergies and tensions between the systems — where do they reinforce each other, and where do they create interesting contradictions?

Do NOT use headers, bullet points, or numbered lists. Write in flowing prose. Reference specific types and functions by name.`

type RequestMode = 'backstory' | 'report'

const PROMPTS: Record<RequestMode, { system: string; user: (summary: string) => string }> = {
  backstory: {
    system: BACKSTORY_PROMPT,
    user: (s) => `Write a backstory for this character:\n\n${s}`,
  },
  report: {
    system: REPORT_PROMPT,
    user: (s) => `Analyze how this character's typology systems come together:\n\n${s}`,
  },
}

// ============================================================
// RATE LIMITING (in-memory, resets on worker restart)
// ============================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, maxPerMinute: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= maxPerMinute) {
    return false
  }

  entry.count++
  return true
}

// ============================================================
// HANDLER
// ============================================================

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = env.ALLOWED_ORIGIN ?? '*'
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Rate limiting
    const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown'
    const maxPerMinute = parseInt(env.RATE_LIMIT_PER_MINUTE ?? '10', 10)

    if (!checkRateLimit(ip, maxPerMinute)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request
    let characterSummary: string
    let mode: RequestMode
    try {
      const body = await request.json() as { characterSummary?: string; mode?: string }
      if (!body.characterSummary || typeof body.characterSummary !== 'string') {
        return new Response(JSON.stringify({ error: 'Missing characterSummary in request body' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      characterSummary = body.characterSummary
      mode = body.mode === 'report' ? 'report' : 'backstory'
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Call Workers AI
    const prompt = PROMPTS[mode]
    try {
      const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user(characterSummary) },
        ],
        max_tokens: mode === 'report' ? 1024 : 512,
      })

      const text = result.response ?? ''
      const responseKey = mode === 'report' ? 'report' : 'backstory'

      return new Response(JSON.stringify({ [responseKey]: text }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Workers AI error:', err)
      return new Response(JSON.stringify({ error: 'Generation failed. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  },
}
