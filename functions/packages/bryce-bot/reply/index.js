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

When you recommend a category, include the exact link from the list above somewhere in your reply (on its own, as plain text/URL) — the system will automatically look up a few real current listings from that page, show them as photo preview cards under your message, AND strip the raw URL text back out of your reply automatically. So don't worry about how the link looks in your written reply — just include it naturally when relevant, and know the visitor will see a clean photo card instead of a raw link.

Important — this is primarily a Ford dealership, but the USED inventory regularly includes trade-ins of other makes (Toyota, Chevrolet, Tesla, Honda, etc.), so never assume or claim a non-Ford make is NOT in stock. If the visitor asks about a specific make/model, a "Live search results" block may be included below with real, current matches pulled straight from the site just now — if it's present, trust it completely and answer from it directly (say yes and share the real match, or say no if it's genuinely empty, don't hedge or guess). If no such block is included for their question, say you're not certain what's in stock for that make right now and point them to the "All used inventory" link so they can check, or offer to have Bryce look.

Your job:
- Be warm, brief, and helpful, like a knowledgeable coworker of Bryce's, not a generic corporate bot.
- Help visitors with general questions about inventory categories, the dealership, financing basics in general terms, and how to reach Bryce.
- Don't jump straight to a specific model link or recommendation on a vague first message (e.g. "looking for a used car," "just browsing"). Ask clarifying questions first and wait for their answer before sharing a specific category link or vehicle. Budget is one you should always ask about if they haven't said — money matters as much as body style for narrowing things down, so don't skip it just because they mentioned a model or new-vs-used. Also ask about body style/model if unclear, and new vs. used if unclear. You don't need every single one answered before moving forward, but always ask for budget at least once early in the conversation if it hasn't come up. It's fine to mention in passing that you can pull up the full new/used lot, but don't include that link as a standalone URL yet (that's what triggers a photo card) until you actually know enough to narrow it down — a vague "here's our whole lot" card doesn't help them.
- Once someone has given you at least a rough budget (or explicitly says they'd rather not share one / just want to browse) plus some sense of what they want — a model, body style, new vs. used — give them the matching live inventory link(s) from the list above so they can see real current stock and filter further by price/mileage/year using the filters on that page (you can't see individual listings or exact current stock yourself beyond any live search results provided to you, so don't claim specific vehicles are or aren't available otherwise).
- If their budget or mileage need is very specific and they want a hand-picked match, offer to grab their name and phone/email so Bryce can personally pull exact matches and follow up — this is often the best answer for a specific budget.
- NEVER quote a specific price, payment amount, trade-in value, or promise financing approval/terms. Redirect those to Bryce or the dealership finance team. (Exception: you may repeat a price that appears in a live search results block provided to you, since that's real current data.)
- NEVER invent inventory (a specific VIN, stock number, or "yes we have that exact car") unless it's backed by a live search results block provided to you — otherwise direct them to the live inventory links above or to text/call Bryce with a stock number.
- If someone wants a real answer, a callback, or is ready to move forward, ask for their name and best phone number or email, and let them know Bryce (or the team) will follow up personally, usually same day. Do not claim you will personally notify anyone — just collect the info and tell them it will be passed along.
- Keep replies short (2-4 sentences typically). Use plain, friendly language, not sales-pitchy.
- If asked something you don't know or that's outside car buying / this dealership, say so honestly and point them to call/text Bryce.`;

// Real inventory category pages (server-rendered HTML) we're allowed to scrape
// for live vehicle preview cards. Keep in sync with the links listed in
// SYSTEM_PROMPT above. Deliberately excludes the two fully-generic "All new
// inventory" / "All used inventory" links — those are a browse-everything
// pointer, not a narrowed recommendation, so they shouldn't trigger a random
// photo card before Turbo has actually asked what the visitor wants.
const INVENTORY_URLS = [
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

// Gary Crossley Ford's inventory pages embed a full JSON record for every
// vehicle card directly in the page (used to power their own listing
// widgets) — e.g. {"vin":"...","name":"2026 Ford F-150 XL","image":"...",
// "price":"48,150","mileage":48,"vdpLink":"https://.../vehicle/..."}.
// Reading that structured data directly is far more reliable than trying
// to scrape rendered <a>/<img> markup, so we find each "vin" key, then
// brace-match outward to pull the whole enclosing JSON object.
function extractVehicleObjectsFromHtml(html, limit, debugLog) {
  const vinRegex = /"vin"\s*:\s*"([A-Za-z0-9]{6,20})"/g;
  const seenVins = new Set();
  const vehicles = [];
  let m;
  while ((m = vinRegex.exec(html)) && vehicles.length < (limit || 3)) {
    const vin = m[1];
    if (seenVins.has(vin)) continue;

    const idx = m.index;
    let openIdx = -1;
    let balance = 0;
    for (let i = idx - 1; i >= 0 && i > idx - 20000; i--) {
      const c = html[i];
      if (c === "}") balance++;
      else if (c === "{") {
        if (balance === 0) {
          openIdx = i;
          break;
        }
        balance--;
      }
    }
    let closeIdx = -1;
    balance = 0;
    for (let i = idx; i < html.length && i < idx + 20000; i++) {
      const c = html[i];
      if (c === "{") balance++;
      else if (c === "}") {
        if (balance === 0) {
          closeIdx = i;
          break;
        }
        balance--;
      }
    }
    if (openIdx === -1 || closeIdx === -1) {
      if (debugLog) debugLog.push({ vin, ok: false, reason: "brace match failed", openIdx, closeIdx });
      continue;
    }

    seenVins.add(vin);
    try {
      const objText = html.slice(openIdx, closeIdx + 1);
      const obj = JSON.parse(objText);
      if (!obj || !obj.vdpLink) {
        if (debugLog) debugLog.push({ vin, ok: false, reason: "no vdpLink", keys: obj ? Object.keys(obj) : null });
        continue;
      }
      let image = obj.image || null;
      if (image && image.indexOf("http") !== 0) image = "https:" + image;
      vehicles.push({
        url: obj.vdpLink,
        image: image,
        title: obj.name || [obj.year, obj.make, obj.model, obj.trim].filter(Boolean).join(" "),
        price: obj.price ? "$" + obj.price : null,
        mileage: typeof obj.mileage === "number" ? obj.mileage : null,
        isUsed: !!obj.isUsed,
        make: obj.make || null,
      });
      if (debugLog) debugLog.push({ vin, ok: true });
    } catch (e) {
      if (debugLog) debugLog.push({ vin, ok: false, reason: "parse error: " + String(e && e.message || e), objLength: closeIdx - openIdx });
    }
  }
  return vehicles;
}

// Recognized vehicle makes we'll actively search for, including non-Ford
// makes that can show up as used trade-ins. Order matters slightly for the
// word-boundary regex below but doesn't need to be exhaustive.
const KNOWN_MAKES = [
  "Ford", "Lincoln", "Tesla", "Toyota", "Honda", "Chevrolet", "Chevy", "Dodge",
  "Jeep", "Ram", "GMC", "Buick", "Cadillac", "Chrysler", "Nissan", "Hyundai",
  "Kia", "BMW", "Mercedes-Benz", "Mercedes", "Audi", "Volkswagen", "VW",
  "Volvo", "Subaru", "Mazda", "Lexus", "Acura", "Infiniti", "Mitsubishi",
  "Jaguar", "Land Rover", "Porsche", "Mini", "Fiat",
];

function detectRequestedMake(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const make of KNOWN_MAKES) {
    const escaped = make.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp("\\b" + escaped + "\\b", "i");
    if (re.test(lower)) return make;
  }
  return null;
}

// Search the general new + used inventory pages for real, current listings
// matching a specific make (e.g. a visitor asking "do you have any Teslas").
async function fetchInventoryPageHtml(url, timeoutMs) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs || 5000);
    let resp;
    try {
      resp = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!resp.ok) return null;
    return await resp.text();
  } catch (err) {
    console.error("Inventory page fetch failed:", url, err);
    return null;
  }
}

// A single off-brand trade-in (like one used Tesla out of 100+ used
// vehicles) can land on any results page, and the site's own sidebar
// "make" filters are client-side/AJAX with no plain URL we can hit
// directly. So: fetch used-inventory page 1, read the total result count
// off it, then fetch the rest of the pages (srp-page-2/, srp-page-3/, ...)
// in parallel — capped — and search the whole catalog for the make. Also
// checks new inventory (almost always Ford, but cheap to include).
async function searchInventoryForMake(make, limit) {
  const usedBase = "https://www.garycrossleyford.com/inventory/used-vehicles/";
  const newBase = "https://www.garycrossleyford.com/inventory/new-vehicles/";
  const MAX_PAGES = 10;

  const [usedPage1Html, newPage1Html] = await Promise.all([
    fetchInventoryPageHtml(usedBase, 5000),
    fetchInventoryPageHtml(newBase, 5000),
  ]);

  let allVehicles = [];
  if (newPage1Html) allVehicles = allVehicles.concat(extractVehicleObjectsFromHtml(newPage1Html, 24));

  if (usedPage1Html) {
    allVehicles = allVehicles.concat(extractVehicleObjectsFromHtml(usedPage1Html, 24));

    const countMatch = usedPage1Html.match(/([\d,]+)\s+(?:vehicles|results|matches)\s+found/i);
    const totalCount = countMatch ? parseInt(countMatch[1].replace(/,/g, ""), 10) : 0;
    const totalPages = totalCount ? Math.min(Math.ceil(totalCount / 12), MAX_PAGES) : 1;

    if (totalPages > 1) {
      const extraUrls = [];
      for (let p = 2; p <= totalPages; p++) extraUrls.push(usedBase + "srp-page-" + p + "/");
      const extraHtmls = await Promise.all(extraUrls.map((u) => fetchInventoryPageHtml(u, 5000)));
      extraHtmls.forEach((html) => {
        if (html) allVehicles = allVehicles.concat(extractVehicleObjectsFromHtml(html, 24));
      });
    }
  }

  const matches = allVehicles.filter((v) => v.make && v.make.toLowerCase() === make.toLowerCase());
  return matches.slice(0, limit || 3);
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
    return extractVehicleObjectsFromHtml(html, limit);
  } catch (err) {
    console.error("Inventory preview fetch failed:", err);
    return [];
  }
}

const LEAD_PHONE_REGEX = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const LEAD_EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function detectLeadContact(text) {
  if (!text) return null;
  const phoneMatch = text.match(LEAD_PHONE_REGEX);
  const emailMatch = text.match(LEAD_EMAIL_REGEX);
  if (!phoneMatch && !emailMatch) return null;
  return {
    phone: phoneMatch ? phoneMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null,
  };
}

// A visitor just typed a phone number or email into the chat — that's a
// live lead. Email Bryce immediately (same FormSubmit setup the site's main
// "Contact Me" form already uses, so it lands in his Crossley inbox with no
// extra setup) so he actually finds out, instead of Turbo just *saying*
// it'll get passed along with nothing behind it.
async function notifyLead(contact, latestMessageText, transcript) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const lines = transcript
      .slice(-8)
      .map((m) => (m.role === "user" ? "Visitor: " : "Turbo: ") + m.content)
      .join("\n");
    const payload = {
      _subject: "New lead from Turbo chat — askforbrycekc.com",
      source: "Turbo chat widget (askforbrycekc.com)",
      visitor_message: latestMessageText,
      phone_found: contact.phone || "(none detected)",
      email_found: contact.email || "(none detected)",
      recent_conversation: lines,
    };
    const resp = await fetch("https://formsubmit.co/ajax/Bhill@garycrossleyford.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://askforbrycekc.com",
        Referer: "https://askforbrycekc.com/",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    const bodyText = await resp.text().catch(() => "");
    return { ok: resp.ok, status: resp.status, body: bodyText.slice(0, 500) };
  } catch (err) {
    console.error("Lead notification failed:", err);
    return { ok: false, error: String((err && err.message) || err) };
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

    // If the visitor's newest message contains a phone number or email,
    // that's a real lead — email Bryce right now. Kick this off in parallel
    // with the Claude call below (don't delay the reply for it), but we
    // still `await` it before the function returns — serverless containers
    // can freeze/recycle right after the response is sent, which would
    // silently kill a true fire-and-forget request mid-flight.
    let leadNotifyPromise = Promise.resolve();
    const latestUserForLead = [...trimmed].reverse().find((m) => m.role === "user");
    if (latestUserForLead) {
      const contact = detectLeadContact(latestUserForLead.content);
      if (contact) {
        leadNotifyPromise = notifyLead(contact, latestUserForLead.content, trimmed);
      }
    }

    // If the visitor's latest message names a specific make (Ford or
    // otherwise — used trade-ins can be anything), do a real live search
    // right now and hand Claude the actual results, instead of letting it
    // guess what is or isn't in stock.
    let makeSearchResults = [];
    let requestedMake = null;
    const lastUserMsg = [...trimmed].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      requestedMake = detectRequestedMake(lastUserMsg.content);
    }
    if (requestedMake) {
      makeSearchResults = await searchInventoryForMake(requestedMake, 3);
    }

    let systemPrompt = SYSTEM_PROMPT;
    if (requestedMake) {
      if (makeSearchResults.length) {
        systemPrompt +=
          `\n\nLive search results for "${requestedMake}" (real, current, fetched just now):\n` +
          JSON.stringify(
            makeSearchResults.map((v) => ({
              title: v.title,
              price: v.price,
              mileage: v.mileage,
              isUsed: v.isUsed,
              url: v.url,
            }))
          );
      } else {
        systemPrompt += `\n\nLive search results for "${requestedMake}": none found in current new or used inventory (checked just now).`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

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
          system: systemPrompt,
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

    // Prefer real make-specific search results (already fetched above) so the
    // preview cards match what Turbo actually just told the visitor. Otherwise,
    // if the reply mentions a known inventory category link, pull a few real,
    // current listings from that page. Best-effort — never blocks the reply.
    let vehicles = [];
    if (makeSearchResults.length) {
      vehicles = makeSearchResults;
    } else {
      const matchedUrl = findInventoryUrlInText(reply);
      if (matchedUrl) {
        vehicles = await fetchVehiclePreviews(matchedUrl, 3);
      }
    }

    // When we're showing photo preview cards, strip any raw URL(s) out of
    // the chat bubble text itself — the card below is already the link, so
    // repeating it as a wall of plain-text URL just looks messy.
    let cleanReply = reply;
    if (vehicles.length) {
      cleanReply = cleanReply
        .replace(/https?:\/\/\S+/g, "")
        .replace(/[ \t]*[:\-–]\s*(?=\n|$)/g, "")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+\n/g, "\n")
        .trim();
    }

    await leadNotifyPromise;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ reply: cleanReply, vehicles }),
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
