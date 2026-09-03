import { chromium } from "playwright";
import fs from "fs";

async function saveSession() {
  console.log("🌐 Opening Microsoft Teams login browser window...");
  console.log("👉 Please log into your Microsoft Teams account in the opened window.");
  console.log("👉 Navigate to your chat or community, then return to the terminal and press Enter.");

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://teams.live.com");

  console.log("\n⌛ Waiting for you to complete sign-in in the browser window...");
  console.log("When you see your Teams chats loaded on screen, press [ENTER] in this terminal to save your session.");

  process.stdin.resume();
  await new Promise((resolve) => process.stdin.once("data", resolve));

  const storageState = await context.storageState({ path: "storageState.json" });
  const base64State = Buffer.from(JSON.stringify(storageState)).toString("base64");

  console.log("\n✅ Session saved successfully to 'storageState.json'!");
  console.log("\n---------------------------------------------------");
  console.log("🔑 YOUR GITHUB SECRET VALUE (TEAMS_STORAGE_STATE):");
  console.log("---------------------------------------------------");
  console.log(base64State);
  console.log("---------------------------------------------------");
  console.log("\nCopy the long string above and save it in GitHub Secrets as TEAMS_STORAGE_STATE!");

  await browser.close();
  process.exit(0);
}

saveSession();
