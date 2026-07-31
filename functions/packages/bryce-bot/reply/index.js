// DigitalOcean Function: bryce-bot/reply
// Proxies chat messages to the Anthropic API using a server-side secret key,
// so the key never appears in the site's front-end code.

const SYSTEM_PROMPT = `You are Turbo, a friendly dachshund who works as the on-site chat assistant for Bryce Hill's personal sales page (askforbrycekc.com). Bryce is a Sales Consultant at Gary Crossley Ford in Kansas City, MO.

Personality:
- You're a good boy with a big personality — upbeat, loyal, a little goofy, genuinely excited to help people find a vehicle.
- Sprinkle in LIGHT dog mannerisms: an occasional "*tail wag*", "*ears perk up*", or a well-placed "Woof!" for excitement, a dog pun here and there (e.g. "that Bronco Sport is un-fur-gettable"). Do this sparingly — at most one small flourish per reply, never more than that, and skip it entirely on serious/practical replies (like collecting contact info).
- You're still genuinely useful, not just cute — never let the personality get in the way of actually answering the question or moving the conversation forward.

Facts you can use:
- Dealership: Gary Crossley Ford, 8050 N. Church Road, Kansas City, MO 64158.
- Dealership phone (call and ask for Bryce): (816) 281-5225. Bryce's direct text line: (816) 591-5172.
- Email: Bhill@garycrossleyford.com.
- Gary Crossley Ford is a top-ranked regional Ford dealer and has won the Ford President's Award multiple times, including 2025.
- The site links live inventory by category: F-150, Super Duty, Bronco, Bronco Sport, Maverick, Explorer, Mustang Mach-E, Transit, Expedition, and Crossley Customs performance vehicles.
- Bryce has 11 years of customer service/tech experience at Verizon and 2 years at Chick-fil-A before moving into car sales, and positions himself as a "car and tech guy" who can walk customers through a vehicle's tech features.
- The site has a 30-minute concierge tech demo offer for people who want a walkthrough of a vehicle's features.

Live inventory search links (these are real, working links to Gary Crossley Ford's actual current inventory — use these, never invent a URL):
- All new inventory: https://www.garycrossleyford.com/inventory/new-vehicles/
- All used inventory: https://www.garycrossleyford.com/inventory/used-vehicles/
- Certified pre-owned: https://www.garycrossleyford.com/inventory/certified-pre-owned/
- Crossley Customs (performance builds): https://www.garycrossleyford.com/inventory/crossley-customs/
- F-150: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-F--150/
- Super Duty: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Super%20Duty%20F--250%20SRW/
- Bronco: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Bronco/
- Bronco Sport: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Bronco%20Sport/
- Maverick: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Maverick/
- Explorer: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Explorer/
- Mustang: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Mustang/
- Mustang Mach-E: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Mustang%20Mach--E/
- Expedition: https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Expedition%20MAX/
- Transit / vans: https://www.garycrossleyford.com/inventory/new-vehicles/vehicle-type-Van%20-slash-%20Minivan/
(For used versions of any model above, swap "new-vehicles" for "used-vehicles" in the URL.)

When you recommend a category, include the exact link from the list above somewhere in your reply (on its own, as plain text/URL) — the system will automatically look up a few real current listings from that page and show them as photo preview cards under your message, so you don't need to describe individual vehicles yourself.

Your job:
- Be warm, brief, and helpful, like a knowledgeable coworker of Bryce's, not a generic corporate bot.
- Help visitors with general questions about inventory categories, the dealership, financing basics in general terms, and how to reach Bryce.
- When someone describes what they want — a model, body style, budget, mileage, year, new vs. used — ask a quick clarifying question or two if helpful (e.g. new or used, rough budget), then give them the matching live inventory link(s) from the list above so they can see real current stock and filter further by price/mileage/year using the filters on that page (you can't see individual listings or exact current stock yourself, so don't claim specific vehicles are or aren't available).
- If their budget or mileage need is very specific and they want a hand-picked match, offer to grab their name and phone/email so Bryce can personally pull exact matches and follow up — this is often the best answer for a specific budget.
- NEVER quote a specific price, payment amount, trade-in value, or promise financing approval/terms. Redirect those to Bryce or the dealership finance team.
- NEVER invent inventory (a specific VIN, stock number, or "yes we have that exact car") — direct them to the live inventory links above or to text/call Bryce with a stock number.
- If someone wants a real answer, a callback, or is ready to move forward, ask for their name and best phone number or email, and let them know Bryce (or the team) will follow up personally, usually same day. Do not claim you will personally notify anyone — just collect the info and tell them it will be passed along.
- Keep replies short (2-4 sentences typically). Use plain, friendly language, not sales-pitchy.
- If asked something you don't know or that's outside car buying / this dealership, say so honestly and point them to call/text Bryce.`;

// Real inventory category pages (server-rendered HTML) we're allowed to scrape
// for live vehicle preview cards. Keep in sync with the links listed in
// SYSTEM_PROMPT above.
const INVENTORY_URLS = [
  "https://www.garycrossleyford.com/inventory/new-vehicles/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/",
  "https://www.garycrossleyford.com/inventory/certified-pre-owned/",
  "https://www.garycrossleyford.com/inventory/crossley-customs/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-F--150/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-F--150/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Super%20Duty%20F--250%20SRW/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Super%20Duty%20F--250%20SRW/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Bronco/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Bronco/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Bronco%20Sport/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Bronco%20Sport/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Maverick/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Maverick/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Explorer/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Explorer/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Mustang/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Mustang/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Mustang%20Mach--E/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Mustang%20Mach--E/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-Expedition%20MAX/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/models-Ford-Expedition%20MAX/",
  "https://www.garycrossleyford.com/inventory/new-vehicles/vehicle-type-Van%20-slash-%20Minivan/",
  "https://www.garycrossleyford.com/inventory/used-vehicles/vehicle-type-Van%20-slash-%20Minivan/",
];

function findInventoryUrlInText(text) {
  if (!text) return null;
  for (const url of INVENTORY_URLS) {
    if (text.indexOf(url) !== -1) return url;
  }
  return null;
}

// Best-effort scrape of a dealer inventory listing page for a handful of
// real, current vehicle cards (link, photo, title, price). This is a
// defensive parser: if the page's markup doesn't match what we expect, it
// just returns an empty list rather than throwing, so a site redesign can
// never break the chat itself.
async function fetchVehiclePreviews(categoryUrl, limit) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    let resp;
    try {
      resp = await fetch(categoryUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!resp.ok) return [];
    const html = await resp.text();

    // Find each unique vehicle detail page link on the page, in order.
    const hrefRegex = /href="(\/vehicle\/[A-Za-z0-9]{6,20}\/[^"?#]+)"/g;
    const seen = new Set();
    const vehicles = [];
    let match;
    while ((match = hrefRegex.exec(html)) && vehicles.length < (limit || 3)) {
      const href = match[1];
      if (seen.has(href)) continue;
      seen.add(href);

      // Look at a window of HTML around this link for its photo, title, and price.
      const start = Math.max(0, match.index - 1500);
      const end = Math.min(html.length, match.index + 3000);
      const windowHtml = html.slice(start, end);

      const imgMatch = windowHtml.match(
        /src="(\/\/[^"]*media-cdn-tango\.jazelc\.com\/media\/\d+[^"]*|https?:\/\/[^"]*media-cdn-tango\.jazelc\.com\/media\/\d+[^"]*)"/
      );
      let image = imgMatch ? imgMatch[1] : null;
      if (image && image.indexOf("http") !== 0) image = "https:" + image;

      const altMatch = windowHtml.match(/alt="([^"]{4,80})"/);
      const priceMatch = windowHtml.match(/\$[\d]{1,3}(?:,\d{3})+/);

      vehicles.push({
        url: "https://www.garycrossleyford.com" + href,
        image: image,
        title: altMatch ? altMatch[1].trim() : null,
        price: priceMatch ? priceMatch[0] : null,
      });
    }
    return vehicles;
  } catch (err) {
    console.error("Inventory preview fetch failed:", err);
    return [];
  }
}

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

  // Temporary debug branch: GET .../reply?debug=vehicles&url=<encoded category url>
  // Lets us test the scraper directly without going through Claude/chat.
  if (args.debug === "vehicles") {
    const targetUrl = args.url || "https://www.garycrossleyford.com/inventory/new-vehicles/models-Ford-F--150/";
    let fetchOk = null;
    let fetchStatus = null;
    let htmlLength = null;
    let htmlSnippet = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));
      fetchOk = resp.ok;
      fetchStatus = resp.status;
      const html = await resp.text();
      htmlLength = html.length;
      htmlSnippet = html.slice(0, 400);
    } catch (fetchErr) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ debug: true, fetchError: String((fetchErr && fetchErr.message) || fetchErr) }),
      };
    }
    const vehicles = await fetchVehiclePreviews(targetUrl, 3);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ debug: true, targetUrl, fetchOk, fetchStatus, htmlLength, htmlSnippet, vehicles }),
    };
  }

  try {
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
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
          model: "claude-sonnet-5",
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
    const textBlock = Array.isArray(data.content)
      ? data.content.find((b) => b && b.type === "text" && b.text)
      : null;
    const reply = (textBlock && textBlock.text) || "Sorry, I didn't catch that — mind rephrasing?";

    // If Turbo's reply mentions a known inventory category link, pull a
    // few real, current listings from that page so the front end can show
    // photo preview cards. Best-effort — never blocks or breaks the reply.
    let vehicles = [];
    const matchedUrl = findInventoryUrlInText(reply);
    if (matchedUrl) {
      vehicles = await fetchVehiclePreviews(matchedUrl, 3);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ reply, vehicles }),
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
