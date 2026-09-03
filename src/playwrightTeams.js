import { chromium } from "playwright";
import fs from "fs";
import zlib from "zlib";

export async function postToTeamsViaPlaywright(lesson, options = {}) {
  const {
    targetChatName = process.env.TEAMS_TARGET_CHAT || "CDN-learning",
    isHeadless = process.env.HEADLESS !== "false",
    dryRun = false
  } = options;

  // Format message text
  const messageContent = [
    `🌐 DAILY CDN MINI-LESSON #${lesson.id}: ${lesson.title}`,
    ``,
    `🍕 Real-Life Analogy: ${lesson.analogy}`,
    `${lesson.analogyText}`,
    ``,
    `📖 What is it?`,
    `${lesson.explanation}`,
    ``,
    `💻 Code Example:`,
    `\`\`\``,
    `${lesson.codeSnippet}`,
    `\`\`\``,
    ``,
    `💡 Key Takeaway: ${lesson.takeaway}`
  ].join("\n");

  if (dryRun) {
    console.log("---------------------------------------------------");
    console.log("🔍 DRY RUN MODE (PLAYWRIGHT): Message preview:");
    console.log(messageContent);
    console.log("---------------------------------------------------");
    return { success: true, dryRun: true };
  }

  console.log(`🌐 Launching Playwright browser (Headless: ${isHeadless})...`);

  // Load Storage State (from file or GitHub Secret base64)
  let storageStateData = null;

  if (process.env.TEAMS_STORAGE_STATE) {
    console.log("🔑 Using session state from TEAMS_STORAGE_STATE environment variable...");
    const rawBuffer = Buffer.from(process.env.TEAMS_STORAGE_STATE.trim(), "base64");
    let jsonStr;
    try {
      jsonStr = zlib.gunzipSync(rawBuffer).toString("utf-8");
    } catch {
      jsonStr = rawBuffer.toString("utf-8");
    }
    storageStateData = JSON.parse(jsonStr);
  } else if (fs.existsSync("storageState.json")) {
    console.log("🔑 Using local 'storageState.json' session file...");
    storageStateData = "storageState.json";
  } else {
    console.warn("⚠️ No session state found! Please run 'npm run login' first to save your authenticated session.");
  }

  const browser = await chromium.launch({
    headless: isHeadless,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const contextOptions = {};
  if (storageStateData) {
    contextOptions.storageState = storageStateData;
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    console.log("📱 Navigating to Microsoft Teams Web App (https://teams.live.com)...");
    await page.goto("https://teams.live.com", { waitUntil: "domcontentloaded", timeout: 60000 });

    console.log(`🔎 Searching for chat/channel: "${targetChatName}"...`);
    await page.waitForTimeout(5000);

    const targetChatSelector = `text="${targetChatName}"`;
    const chatElement = page.locator(targetChatSelector).first();

    if (await chatElement.isVisible()) {
      console.log(`✅ Found chat "${targetChatName}", clicking...`);
      await chatElement.click();
    } else {
      console.log(`🔍 Chat "${targetChatName}" not immediately visible, searching via search bar...`);
      const searchBox = page.locator('input[placeholder*="Search"], input[aria-label*="Search"]').first();
      if (await searchBox.isVisible()) {
        await searchBox.fill(targetChatName);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(3000);
        await page.locator(`text="${targetChatName}"`).first().click();
      }
    }

    await page.waitForTimeout(3000);

    console.log("✍️ Entering daily lesson message into editor...");
    const editor = page.locator('[contenteditable="true"], textarea[aria-label*="Type a message"], div[role="textbox"]').first();
    
    if (await editor.isVisible()) {
      await editor.focus();
      
      const lines = messageContent.split("\n");
      for (const line of lines) {
        await page.keyboard.type(line);
        await page.keyboard.press("Shift+Enter");
      }
      
      console.log("🚀 Pressing Send...");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(3000);

      await page.screenshot({ path: "teams_posted.png" });
      console.log("📸 Screenshot saved as 'teams_posted.png'.");
      console.log(`✅ Lesson #${lesson.id} successfully posted to Teams!`);
    } else {
      throw new Error("Could not locate Teams chat message input box.");
    }
  } catch (err) {
    console.error("❌ Playwright automation error:", err.message);
    await page.screenshot({ path: "teams_error.png" });
    throw err;
  } finally {
    await browser.close();
  }
}
