# Deploying the Turbo chat history dashboard

Everything in the zip checks out — the function's syntax is clean, the endpoint path
(`/askforbrycekc-functions/bryce-bot/reply`) matches between `index.html` and
`turbo-history.html`, and the session ID the widget generates is the same one the
function stores. Nothing needs fixing before it goes up.

There are four steps: get Redis credentials, add the env vars in DigitalOcean, push
the files, verify.

---

## Step 1 — Find out whether Upstash Redis already exists

Fastest way to check, no login to Upstash needed:

1. DigitalOcean → **Apps** → your askforbrycekc app
2. **Settings** → click the **functions component** (`askforbrycekc-functions`)
3. Scroll to **Environment Variables**

If you see `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` already listed,
you're set — skip to Step 2 and only add `DASHBOARD_PASSWORD`.

**If they're not there, create the database:**

1. Go to [console.upstash.com](https://console.upstash.com) and sign in (Google/GitHub login works)
2. If a Redis database already exists in your account, open it. Otherwise **Create Database**:
   - Name: `turbo-history`
   - Type: Regional
   - Region: pick the one closest to your DigitalOcean app region
   - Free tier is plenty — 500K commands/month, and each chat message is 2 commands
3. On the database page, find the **REST API** section (not the redis:// connection string)
4. Copy the two values: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

---

## Step 2 — Set the environment variables in DigitalOcean

Same place as above: **Apps → your app → Settings → functions component → Environment Variables → Edit**.

You need all four. The first one is probably already there from the existing chat bot.

| Key | Value | Encrypt? |
|---|---|---|
| `ANTHROPIC_API_KEY` | (already set) | yes |
| `UPSTASH_REDIS_REST_URL` | from Upstash REST API section | yes |
| `UPSTASH_REDIS_REST_TOKEN` | from Upstash REST API section | yes |
| `DASHBOARD_PASSWORD` | a password you pick — this is new | yes |

**Two things that will bite you if you miss them:**

- These have to go on the **functions component**, not the static site component or the
  app-level settings. `project.yml` reads them from the function's own environment.
- Check **Encrypt** on the secrets. Once encrypted DigitalOcean won't show them back to
  you, so save them somewhere first.

On `DASHBOARD_PASSWORD`: pick something you don't use anywhere else. The page sends it
in the request body over HTTPS and caches it in `sessionStorage`, which is fine for
this, but it's the only thing standing between the internet and your visitors'
conversations.

Save. DigitalOcean will redeploy on its own — that's expected.

---

## Step 3 — Upload the files through GitHub

Unzip `turbo-history-deploy.zip` first. Inside you'll find:

```
index.html                              ← replaces existing
robots.txt                              ← replaces existing
turbo-history.html                      ← new
project.yml                             ← replaces existing
packages/bryce-bot/reply/index.js       ← replaces existing
```

**Check this before you upload:** if your functions source directory isn't the repo root
— some setups keep it in a `functions/` or `serverless/` subfolder — then `project.yml`
and `packages/` go *there*, not at the root. The three HTML/txt files always go wherever
your current `index.html` lives. Open your repo and look at where the existing
`project.yml` sits, then match it.

### Uploading

1. Open your repo on GitHub → **Add file** → **Upload files**
2. Open the unzipped `turbo-history-deploy` folder, select the files **inside** it, and
   drag those into the browser

**The trap:** don't drag the `turbo-history-deploy` folder itself. GitHub will preserve
the folder name and create a `turbo-history-deploy/` directory at your repo root — the
function won't be found and the site files won't replace anything. You want the
*contents*, so `packages/` lands at the top level.

Drag `packages/` as a folder though — GitHub keeps the nested path, which is what puts
`index.js` at `packages/bryce-bot/reply/index.js`.

3. Scroll down, add a commit message like `Add password-gated Turbo chat history dashboard`
4. Leave **Commit directly to the main branch** selected
5. **Commit changes**

Uploading files with paths that already exist overwrites them in the same commit — that's
expected and what you want for the four replacements.

### If the drag-and-drop fights you

Create the nested file by hand instead: **Add file** → **Create new file**, and type
`packages/bryce-bot/reply/index.js` into the filename box. Typing `/` creates each folder
as you go. Paste the contents of `index.js` in, then commit. Upload the other four
normally.

### Then

DigitalOcean picks up the commit and rebuilds on its own. Watch the **Activity** tab — a
functions build takes a couple minutes longer than a static-only one.

---

## Step 4 — Verify

1. Go to `https://askforbrycekc.com/turbo-history.html` — you should get the password box
2. Enter your `DASHBOARD_PASSWORD` → empty dashboard ("No conversations yet")
3. Open the main site in a **different browser or private window**, chat with Turbo, send
   two or three messages
4. Back on the dashboard, hit **Refresh** — the conversation should appear
5. Click it and confirm the full transcript renders

**If you get "Incorrect password" with the right password:** the env var didn't land on
the functions component, or the redeploy hasn't finished. Check Activity first.

**If the dashboard loads but stays empty after chatting:** the Redis credentials are the
problem. History saving is deliberately best-effort — if Redis is unreachable, the chat
still works normally and just doesn't record. That's the right failure mode, but it does
mean a bad token fails silently. Double-check you copied from the **REST API** section
and not the standard Redis connection string.

---

## Worth knowing

- **History starts at deploy.** Conversations from before this goes live aren't stored
  anywhere, so the dashboard starts empty and fills up from here.
- **The index is capped at 500 sessions** and the list view pulls the 200 newest. Old
  ones fall off the index automatically, so it can't grow forever.
- **`turbo-history.html` is unlisted, not hidden.** It's blocked in `robots.txt` and not
  linked from anywhere on the site, but that only keeps well-behaved crawlers out. The
  password is the actual security.
- **Lead emails are unchanged.** The existing behavior — a visitor leaving a phone number
  or email triggers a notification to `Bhill@garycrossleyford.com` — still works exactly
  as before. The history dashboard is additive.
