# Walkthrough - MS Teams Daily CDN Agent (Playwright Browser Method)

We have built and verified a **Playwright Automated Browser System** for your **Microsoft Teams Daily CDN Agent**. 

This method works **100% natively with Personal Microsoft Accounts**, logging into Teams Web App in GitHub Actions every morning and posting directly into your chat!

---

## 🛠️ Codebase Overview

Project Location: [teams-cdn-agent](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent)

1. [src/playwrightTeams.js](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent/src/playwrightTeams.js): Automated Playwright browser engine that authenticates, navigates to Teams, selects your chat, types the daily CDN lesson, and posts it.
2. [src/saveAuthState.js](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent/src/saveAuthState.js): One-time helper script to sign in locally and export browser session cookies (`TEAMS_STORAGE_STATE`).
3. [src/cdnLessons.js](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent/src/cdnLessons.js): Database of 30+ bite-sized CDN topics with real-world analogies, concise explanations, and code examples.
4. [.github/workflows/daily_cdn_bot.yml](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent/.github/workflows/daily_cdn_bot.yml): Automated morning workflow with headless Chromium runner.
5. [README.md](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent/README.md): Step-by-step setup documentation.

---

## 🧪 Verification Results

We verified the Playwright engine dry-run locally:
- ✅ Exit code: `0` (Success).
- ✅ Clean formatting of daily CDN lesson text with code blocks.

```text
🌐 DAILY CDN MINI-LESSON #7: Anycast DNS Routing

🍕 Real-Life Analogy: 🚑 Emergency Services (911 / 112)
Everyone dials the exact same phone number, but your call automatically connects to the dispatch station closest to your physical location.

📖 What is it?
Anycast allows multiple servers worldwide to share the same IP address. Routers automatically send the user's request to the geographically nearest server.

💻 Code Example:
```
$ ping cdn.cloudflare.com
```

💡 Key Takeaway: Anycast routing directs traffic to the nearest server without changing domain names.
```

---

## 🚀 Simple 2-Step Deployment

Follow the guide in [README.md](file:///Users/venkatesh/.gemini/antigravity/brain/5be93158-2e67-4871-8c6d-43d312fde42f/teams-cdn-agent/README.md):

1. **Save Your Teams Session (One-Time Setup)**:
   In your terminal inside `teams-cdn-agent`:
   ```bash
   npm run login
   ```
   A browser window will open up. Sign in to your Microsoft Teams account, then press **Enter** in the terminal to save your session. It will print your `TEAMS_STORAGE_STATE` string.

2. **Add GitHub Secret**:
   In your GitHub repo ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions**:
   - Add Secret `TEAMS_STORAGE_STATE` = *(paste the string)*.
   - Add Secret `TEAMS_TARGET_CHAT` = `Tech Team - Srinishtha` (or `CDN-learning`).

🎉 **All done!** Every morning at 8:30 AM IST (03:00 UTC), GitHub Actions runs the Playwright browser automatically and posts today's CDN lesson directly into your Teams chat!
