import fs from "fs";
import { compressStorageState } from "./saveAuthState.js";

if (!fs.existsSync("storageState.json")) {
  console.error("❌ 'storageState.json' not found. Please run 'npm run login' first.");
  process.exit(1);
}

const storageState = JSON.parse(fs.readFileSync("storageState.json", "utf-8"));
const base64Secret = compressStorageState(storageState);

console.log(`\n🔑 GITHUB SECRET VALUE (TEAMS_STORAGE_STATE) - Size: ${base64Secret.length} bytes (GitHub Limit: 48,000):`);
console.log("---------------------------------------------------");
console.log(base64Secret);
console.log("---------------------------------------------------");
console.log("\nCopy the compressed string above and paste it into GitHub Secrets as TEAMS_STORAGE_STATE!");
