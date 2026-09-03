import dotenv from "dotenv";
import { getTodayLesson } from "./cdnLessons.js";
import { sendToTeamsWebhook } from "./teamsWebhook.js";
import { postToTeamsViaPlaywright } from "./playwrightTeams.js";

dotenv.config();

async function run() {
  try {
    const isDryRun = process.env.DRY_RUN === "true" || process.argv.includes("--dry-run");
    const usePlaywright = process.env.USE_PLAYWRIGHT === "true" || process.argv.includes("--playwright");

    console.log("🚀 Starting MS Teams Daily CDN Agent...");
    const lesson = getTodayLesson();
    console.log(`📌 Today's Topic: Lesson #${lesson.id} - ${lesson.title}`);

    if (usePlaywright) {
      console.log("🤖 Mode: Playwright Automated Browser");
      await postToTeamsViaPlaywright(lesson, { dryRun: isDryRun });
    } else {
      console.log("📡 Mode: MS Teams Incoming Webhook");
      const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
      await sendToTeamsWebhook(webhookUrl, lesson, isDryRun);
    }
  } catch (error) {
    console.error("❌ Error executing MS Teams CDN Agent:", error.message);
    process.exit(1);
  }
}

run();
