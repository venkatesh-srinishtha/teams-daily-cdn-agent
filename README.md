# 🌐 MS Teams Daily CDN Agent (Playwright Automated Browser)

An automated bot agent that logs into **Microsoft Teams** (Personal & Work accounts) using an automated Playwright browser and posts a daily morning educational update explaining **Content Delivery Network (CDN)** concepts using simple real-world analogies, concise explanations, and code snippets.

---

## 🎨 Sample Daily Teams Message

Each morning, your Teams Chat will receive a clean formatted post:

> 🌐 **DAILY CDN MINI-LESSON #1: What is a CDN?**  
> 
> 🍕 **Real-Life Analogy:** Pizza Delivery Hubs  
> *Instead of baking every pizza at one central restaurant in Italy and shipping it worldwide, Domino's puts local kitchens in every neighborhood so your pizza arrives hot and fast.*  
> 
> 📖 **What is it?**  
> A Content Delivery Network (CDN) is a network of servers spread across the globe. It caches (stores) your website's static files (images, CSS, JS) close to users so pages load instantly.  
> 
> 💻 **Code Example:**  
> ```  
> <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>  
> ```  
> 💡 **Key Takeaway:** CDNs cut down physical distance between your website assets and your users.

---

## 🚀 Easy 2-Step Setup Instructions

### 1️⃣ Step 1: Save Your Teams Session (One-Time Local Login)

Run the one-time login script on your machine to save your Teams browser session cookies:

```bash
# Install dependencies
npm install

# Run login helper
npm run login
```

1. A browser window will open up `https://teams.live.com`.
2. Sign in to your Microsoft Teams account in the browser window.
3. Once logged in and viewing your chats, go back to your terminal and press **[ENTER]**.
4. The script will save `storageState.json` and print a long **`TEAMS_STORAGE_STATE`** string in your terminal! 📋

---

### 2️⃣ Step 2: Add GitHub Secrets

1. Open your repository on **GitHub**.
2. Go to **Settings** ➔ **Secrets and variables** ➔ **Actions**.
3. Click **New repository secret**:
   - **Name**: `TEAMS_STORAGE_STATE`
   - **Secret**: *(Paste the long string copied from Step 1)*
4. Click **Add secret**.
5. *(Optional)* Add another secret `TEAMS_TARGET_CHAT` with your chat name (e.g. `Tech Team - Srinishtha` or `CDN-learning`). Defaults to `Tech Team`.

---

### ⏰ Schedule & Automated Morning Runs

The bot automatically runs every morning at **03:00 UTC (8:30 AM IST)** via GitHub Actions.

To manually trigger a post right now:
1. Go to your GitHub repository **Actions** tab.
2. Select **MS Teams Daily CDN Agent**.
3. Click **Run workflow** ➔ **Run workflow**.
