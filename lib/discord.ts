import type { PartRequest } from "./queries";

/**
 * Posts new part requests to the team's Discord channel.
 *
 * The webhook URL is a credential: anyone holding it can post to the channel,
 * so it is read from a server-only environment variable and must never be
 * prefixed NEXT_PUBLIC_. The integration is optional -- with no URL set the
 * app simply does not notify, which keeps local development quiet.
 */

// Brand maroon from --primary, and the accent used for anything urgent.
const COLOR_BY_PRIORITY: Record<string, number> = {
  high: 0xda950b,
  normal: 0x68323d,
  low: 0x68323d,
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "High",
  normal: "Normal",
  low: "Low",
};

function buildEmbed(request: PartRequest) {
  const priority = request.priority ?? "normal";

  const fields = [
    { name: "Quantity", value: String(request.quantity), inline: true },
    { name: "Priority", value: PRIORITY_LABEL[priority] ?? priority, inline: true },
  ];

  if (request.requested_by) {
    fields.push({ name: "Requested by", value: request.requested_by, inline: true });
  }

  return {
    title: request.part_name,
    description: request.reason || undefined,
    color: COLOR_BY_PRIORITY[priority] ?? COLOR_BY_PRIORITY.normal,
    fields,
    footer: { text: "Retriever · Part request" },
    timestamp: request.created_at ?? new Date().toISOString(),
  };
}

export async function notifyPartRequested(request: PartRequest): Promise<void> {
  const webhook = process.env.DISCORD_REQUEST_WEBHOOK_URL;
  if (!webhook) return;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Retriever",
        embeds: [buildEmbed(request)],
      }),
      // A slow or unreachable Discord must not hold the request form open.
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        `Discord webhook rejected the request notification: ${response.status} ${await response.text()}`,
      );
    }
  } catch (error) {
    // Never surface this to the person filing the request: the request itself
    // is already saved, and a failed notification should not look like a
    // failed submission.
    console.error("Discord webhook failed:", error);
  }
}
