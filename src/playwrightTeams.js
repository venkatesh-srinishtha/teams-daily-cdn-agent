import { chromium } from "playwright";
import fs from "fs";
import zlib from "zlib";

export async function postToTeamsViaPlaywright(lesson, options = {}) {
  const {
    targetChatName = process.env.TEAMS_TARGET_CHAT || "kaushik_srinishtha",
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
    await page.waitForSelector('div[role="listitem"], input[aria-label*="Search"], input[placeholder*="Search"]', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    let chatSelected = false;

    // Generate search term variants (e.g. kaushik_srinishtha vs kaushik_ srinishtha)
    const searchVariants = [
      targetChatName,
      targetChatName.replace("_", "_ "),
      targetChatName.replace("_ ", "_"),
      targetChatName.replace("_", " ")
    ];

    // 1. Try finding exact chat title in sidebar list
    for (const variant of searchVariants) {
      if (!variant) continue;
      const chatElement = page.locator(`[role="listitem"] :text-is("${variant}"), [role="listitem"] :text("${variant}"), [role="treeitem"] :text("${variant}"), text="${variant}"`).first();
      if (await chatElement.isVisible().catch(() => false)) {
        console.log(`✅ Found exact chat title matching "${variant}" in sidebar, clicking...`);
        await chatElement.click();
        chatSelected = true;
        break;
      }
    }

    // 2. If not found in sidebar, use Teams search bar
    if (!chatSelected) {
      console.log(`🔍 Chat "${targetChatName}" not immediately visible in sidebar, searching via search bar...`);
      const searchBox = page.locator('input[placeholder*="Search"], input[aria-label*="Search"], input[data-tid*="search"]').first();
      if (await searchBox.isVisible().catch(() => false)) {
        await searchBox.click();
        await searchBox.fill(targetChatName.replace("_", " "));
        await page.keyboard.press("Enter");
        await page.waitForTimeout(3000);
        
        for (const variant of searchVariants) {
          const searchResult = page.locator(`text="${variant}"`).first();
          if (await searchResult.isVisible().catch(() => false)) {
            console.log(`✅ Found chat result for "${variant}", clicking...`);
            await searchResult.click();
            chatSelected = true;
            break;
          }
        }
      }
    }

    if (!chatSelected) {
      throw new Error(`Target chat "${targetChatName}" could not be found in your MS Teams chat list. Execution aborted to prevent sending to the wrong group.`);
    }

    await page.waitForTimeout(4000);

    console.log("✍️ Entering daily lesson message into editor...");
    const editor = page.locator('[contenteditable="true"], textarea[aria-label*="Type a message"], div[role="textbox"], [data-tid*="ckeditor"]').first();
    
    if (await editor.isVisible()) {
      await editor.focus();
      
      const lines = messageContent.split("\n");
      for (let i = 0; i < lines.length; i++) {
        await page.keyboard.type(lines[i]);
        if (i < lines.length - 1) {
          await page.keyboard.press("Shift+Enter");
        }
      }
      
      await page.waitForTimeout(1000);
      console.log("🚀 Dispatching message (clicking Send button & pressing Enter)...");
      
      // 1. Locate and click Teams Send button (Paper Airplane icon button)
      const sendButtonSelectors = [
        'button[data-tid*="send"]',
        'button[aria-label*="Send"]',
        'button[aria-label*="send"]',
        'button[title*="Send"]',
        'button[title*="send"]',
        '[data-icon-name="Send"]',
        'button:has(svg[data-icon-name="Send"])',
        'button:has(path[d*="M"])'
      ];

      let sent = false;
      for (const selector of sendButtonSelectors) {
        const btn = page.locator(selector).first();
        if (await btn.isVisible().catch(() => false)) {
          console.log(`✅ Found Teams Send button using selector '${selector}', clicking...`);
          await btn.click({ force: true }).catch(() => {});
          sent = true;
          break;
        }
      }

      if (!sent) {
        console.log("⚠️ Send button not directly clicked via selector, attempting keyboard shortcuts...");
        await page.keyboard.press("Control+Enter");
        await page.waitForTimeout(500);
        await page.keyboard.press("Enter");
      }

      await page.waitForTimeout(4000);

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
