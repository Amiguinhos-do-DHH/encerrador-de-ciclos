import z from "zod";
import { heartbeatSchema, helloSchema, gatewaySchema, identifySchema, messageReactionAddSchema } from "./schemas/index.ts";
import { calculateIntents, intents } from "./intents.ts";

const discordUrl = process.env.DISCORD_URL;
const discordToken = process.env.DISCORD_TOKEN;
const response = await fetch(`${discordUrl}/gateway/bot`, { headers: { Authorization: `Bot ${discordToken}` } });
const jsonResponse = await response.json();
const gatewayUrl = `${gatewaySchema.parse(jsonResponse).url}/?v=10&encoding=json`;

const envSchema = z.object({
  DISCORD_URL: z.string().startsWith('https://discord.com/api/'),
  DISCORD_TOKEN: z.string(),
})

const ENV = envSchema.parse({
  DISCORD_URL: Bun.env.DISCORD_URL,
  DISCORD_TOKEN: Bun.env.DISCORD_TOKEN,
})

const sentPayloadSchema = z.discriminatedUnion("op", [heartbeatSchema, identifySchema]).brand<"SentPayload">();
type SentPayload = z.infer<typeof sentPayloadSchema>;
const ws = new WebSocket(gatewayUrl);

const receivedPayloadSchema = z
  .string()
  .transform((val, ctx) => {
    try {
      return JSON.parse(val);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Invalid JSON",
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .pipe(z.discriminatedUnion("op", [messageReactionAddSchema, helloSchema]).brand<"ReceivedPayload">());
type ReceivedPayload = z.infer<typeof receivedPayloadSchema>;

function sendIdentify(): SentPayload {
  return sentPayloadSchema.parse({
    op: 2,
    d: {
      token: ENV.DISCORD_TOKEN,
      properties: {
        os: 'linux',
        browser: 'encerrador-de-ciclos',
        device: 'encerrador-de-ciclos',
      },
      intents: calculateIntents([intents.GuildMessageReactions])
    },
  })
}

function handlePayload(receivedPayload: ReceivedPayload) {
  switch(receivedPayload.op) {
    case 0:
      console.log(receivedPayload)
  }
}
ws.addEventListener("message", (ev: MessageEvent<string>) => {
  const payload = receivedPayloadSchema.safeParse(ev.data);
  if(payload.success) {
    handlePayload(payload.data)
  }
});
