import dotenv from "dotenv";
import { getTodayLesson } from "./cdnLessons.js";
import { generateGeminiLesson } from "./geminiLessonGenerator.js";
import { sendToTeamsWebhook } from "./teamsWebhook.js";
import { postToTeamsViaPlaywright } from "./playwrightTeams.js";

dotenv.config();

async function run() {
  try {
    const isDryRun = process.env.DRY_RUN === "true" || process.argv.includes("--dry-run");
    const usePlaywright = process.env.USE_PLAYWRIGHT === "true" || process.argv.includes("--playwright");

    console.log("🚀 Starting MS Teams Daily CDN Agent...");
    
    // Try generating dynamic lesson with Gemini AI first, fall back to curated curriculum
    let lesson = await generateGeminiLesson();
    if (!lesson) {
      lesson = getTodayLesson();
    }

    console.log(`📌 Today's Topic: Lesson #${lesson.id} - ${lesson.title}${lesson.isAiGenerated ? " (✨ AI Generated)" : ""}`);

    const targetArgIndex = process.argv.findIndex(arg => arg.startsWith("--target"));
    let cliTarget = null;
    if (targetArgIndex !== -1) {
      const arg = process.argv[targetArgIndex];
      if (arg.includes("=")) {
        cliTarget = arg.split("=")[1];
      } else if (process.argv[targetArgIndex + 1]) {
        cliTarget = process.argv[targetArgIndex + 1];
      }
    }
    const targetChatName = cliTarget || process.env.TEAMS_TARGET_CHAT;

    if (usePlaywright) {
      console.log("🤖 Mode: Playwright Automated Browser");
      await postToTeamsViaPlaywright(lesson, { dryRun: isDryRun, targetChatName });
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
