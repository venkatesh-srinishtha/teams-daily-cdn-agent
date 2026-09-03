/**
 * Formats CDN lesson into Microsoft Teams Adaptive Card and posts to Webhook.
 */

export function buildTeamsAdaptiveCard(lesson) {
  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "Container",
              style: "emphasis",
              items: [
                {
                  type: "TextBlock",
                  text: `🌐 DAILY CDN MINI-LESSON #${lesson.id}`,
                  weight: "Bolder",
                  size: "Small",
                  color: "Accent"
                },
                {
                  type: "TextBlock",
                  text: lesson.title,
                  weight: "Bolder",
                  size: "Large",
                  wrap: true
                }
              ]
            },
            {
              type: "Container",
              items: [
                {
                  type: "TextBlock",
                  text: `**Real-Life Analogy:** ${lesson.analogy}`,
                  weight: "Bolder",
                  size: "Medium",
                  wrap: true
                },
                {
                  type: "TextBlock",
                  text: lesson.analogyText,
                  italic: true,
                  wrap: true
                }
              ]
            },
            {
              type: "Container",
              items: [
                {
                  type: "TextBlock",
                  text: "**What is it?**",
                  weight: "Bolder",
                  wrap: true
                },
                {
                  type: "TextBlock",
                  text: lesson.explanation,
                  wrap: true
                }
              ]
            },
            {
              type: "Container",
              style: "accent",
              items: [
                {
                  type: "TextBlock",
                  text: "**Code / Technical Example:**",
                  weight: "Bolder",
                  wrap: true
                },
                {
                  type: "TextBlock",
                  text: `\`\`\`\n${lesson.codeSnippet}\n\`\`\``,
                  fontType: "Monospace",
                  wrap: true
                }
              ]
            },
            {
              type: "Container",
              items: [
                {
                  type: "TextBlock",
                  text: `💡 **Key Takeaway:** ${lesson.takeaway}`,
                  weight: "Bolder",
                  color: "Good",
                  wrap: true
                }
              ]
            }
          ]
        }
      }
    ]
  };
}

/**
 * Send payload to MS Teams Webhook URL.
 */
export async function sendToTeamsWebhook(webhookUrl, lesson, dryRun = false) {
  const cardPayload = buildTeamsAdaptiveCard(lesson);

  if (dryRun) {
    console.log("---------------------------------------------------");
    console.log("🔍 DRY RUN MODE: Adaptive Card payload generated:");
    console.log(JSON.stringify(cardPayload, null, 2));
    console.log("---------------------------------------------------");
    return { success: true, dryRun: true };
  }

  if (!webhookUrl) {
    throw new Error("Missing TEAMS_WEBHOOK_URL environment variable.");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cardPayload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to post to Teams Webhook (${response.status}): ${errorText}`);
  }

  console.log(`✅ Daily CDN Lesson #${lesson.id} ("${lesson.title}") successfully posted to MS Teams!`);
  return { success: true };
}
