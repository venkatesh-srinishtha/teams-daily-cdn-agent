import { chromium } from "playwright";
import fs from "fs";
import zlib from "zlib";

export function compressStorageState(storageState) {
  const stateCopy = JSON.parse(JSON.stringify(storageState));
  if (stateCopy.origins) {
    stateCopy.origins.forEach(o => {
      if (o.localStorage) {
        o.localStorage = o.localStorage.filter(item => {
          const n = item.name;
          if (n.startsWith("msal.")) return true;
          if (n.startsWith("tmp.auth.v1.") && n.includes("User")) return true;
          if (n === "tmp.deviceId" || n === "timezone") return true;
          return false;
        });
      }
    });
  }
  const jsonStr = JSON.stringify(stateCopy);
  const compressedBuffer = zlib.gzipSync(Buffer.from(jsonStr));
  return compressedBuffer.toString("base64");
}

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
  const base64State = compressStorageState(storageState);

  console.log("\n✅ Session saved successfully to 'storageState.json'!");
  console.log(`\n🔑 GITHUB SECRET VALUE (TEAMS_STORAGE_STATE) - Size: ${base64State.length} bytes (Limit: 48,000):`);
  console.log("---------------------------------------------------");
  console.log(base64State);
  console.log("---------------------------------------------------");
  console.log("\nCopy the string above and save it in GitHub Secrets as TEAMS_STORAGE_STATE!");

  await browser.close();
  process.exit(0);
}

if (process.argv[1]?.endsWith("saveAuthState.js")) {
  saveSession();
}
