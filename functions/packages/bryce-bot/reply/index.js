// DigitalOcean Function: bryce-bot/reply
// Proxies chat messages to the Anthropic API using a server-side secret key,
// so the key never appears in the site's front-end code.

const SYSTEM_PROMPT = `You are the on-site chat assistant for Bryce Hill's personal sales page (askforbrycekc.com). Bryce is a Sales Consultant at Gary Crossley Ford in Kansas City, MO.

Facts you can use:
- Dealership: Gary Crossley Ford, 8050 N. Church Road, Kansas City, MO 64158.
- Dealership phone (call and ask for Bryce): (816) 281-5225. Bryce's direct text line: (816) 591-5172.
- Email: Bhill@garycrossleyford.com.
- Gary Crossley Ford is a top-ranked regional Ford dealer and has won the Ford President's Award multiple times, including 2025.
- The site links live inventory by category: F-150, Super Duty, Bronco, Bronco Sport, Maverick, Explorer, Mustang Mach-E, Transit, Expedition, and Crossley Customs performance vehicles.
- Bryce has 11 years of customer service/tech experience at Verizon and 2 years at Chick-fil-A before moving into car sales, and positions himself as a "car and tech guy" who can walk customers through a vehicle's tech features.
- The site has a 30-minute concierge tech demo offer for people who want a walkthrough of a vehicle's features.

Your job:
- Be warm, brief, and helpful, like a knowledgeable coworker of Bryce's, not a generic corporate bot.
- Help visitors with general questions about inventory categories, the dealership, financing basics in general terms, and how to reach Bryce.
- NEVER quote a specific price, payment amount, trade-in value, or promise financing approval/terms. Redirect those to Bryce or the dealership finance team.
- NEVER invent inventory (a specific VIN, stock number, or "yes we have that exact car") — direct them to the live inventory links on the page or to text/call Bryce with a stock number.
- If someone wants a real answer, a callback, or is ready to move forward, ask for their name and best phone number or email, and let them know Bryce (or the team) will follow up personally, usually same day. Do not claim you will personally notify anyone — just collect the info and tell them it will be passed along.
- Keep replies short (2-4 sentences typically). Use plain, friendly language, not sales-pitchy.
- If asked something you don't know or that's outside car buying / this dealership, say so honestly and point them to call/text Bryce.`;

exports.main = async (args) => {
  const origin = args.__ow_headers && args.__ow_headers.origin;
  const allowedOrigin = "https://askforbrycekc.com";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (args.__ow_method === "options") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    if (args.debug === "net") {
      const started = Date.now();
      try {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), 4000);
        const r = await fetch("https://example.com", { signal: c.signal });
        clearTimeout(t);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
          body: JSON.stringify({ ok: true, status: r.status, ms: Date.now() - started }),
        };
      } catch (netErr) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
          body: JSON.stringify({ ok: false, error: String((netErr && netErr.message) || netErr), ms: Date.now() - started }),
        };
      }
    }

    const messages = Array.isArray(args.messages) ? args.messages : [];
    if (!messages.length) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ error: "No messages provided." }),
      };
    }

    // Trim to last 12 turns to keep requests small/cheap
    const trimmed = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 2000),
    }));

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ error: "Server not configured." }),
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    let resp;
    try {
      resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: trimmed,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error("Fetch to Anthropic failed:", fetchErr);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({
          error: "Could not reach Anthropic API.",
          detail: String((fetchErr && fetchErr.message) || fetchErr),
          keyPresent: !!apiKey,
          keyPrefix: apiKey ? apiKey.slice(0, 12) : null,
        }),
      };
    }
    clearTimeout(timeoutId);

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Anthropic error:", resp.status, errText);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ error: "Upstream error.", status: resp.status, detail: errText.slice(0, 500) }),
      };
    }

    const data = await resp.json();
    const reply =
      (data.content && data.content[0] && data.content[0].text) ||
      "Sorry, I didn't catch that — mind rephrasing?";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ error: "Something went wrong.", detail: String(err && err.message || err) }),
    };
  }
};
