import z from "zod";
import { heartbeatSchema, helloSchema, gatewaySchema, identifySchema, messageReactionAddSchema } from "./schemas/index.ts";
import { calculateIntents, intents } from "./intents.ts";
import { type } from "os";

const envSchema = z.object({
  DISCORD_URL: z.string().startsWith('https://discord.com/api/'),
  DISCORD_TOKEN: z.string(),
})

const ENV = envSchema.parse({
  DISCORD_URL: Bun.env.DISCORD_URL,
  DISCORD_TOKEN: Bun.env.DISCORD_TOKEN,
})

const response = await fetch(`${ENV.DISCORD_URL}/gateway/bot`, { headers: { Authorization: `Bot ${ENV.DISCORD_TOKEN}` } });
const jsonResponse = await response.json();
const gatewayUrl = `${gatewaySchema.parse(jsonResponse).url}/?v=10&encoding=json`;

const sentPayloadSchema = z.discriminatedUnion("op", [heartbeatSchema, identifySchema]).brand<"SentPayload">();
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
  .pipe(z.discriminatedUnion("op", [messageReactionAddSchema, helloSchema])).brand<"ReceivedPayload">();
type ReceivedPayload = z.infer<typeof receivedPayloadSchema>;

const identifyPayload: SentPayload = {
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
}

type SentPayload = {
  op: 2,
  d: {
    token: string,
    properties: {
      os: 'linux',
      browser: 'encerrador-de-ciclos',
      device: 'encerrador-de-ciclos',
    },
    intents: number,
  },
} | {
  op: 1,
  d: number | null,
}

type State = {
  lastSequenceNumber: number | null,
}

const state: State = {
  lastSequenceNumber: null,
}

function buildHeartbeatPayload(): SentPayload {
  return {
    op: 1,
    d: state.lastSequenceNumber,
  }
}

function sendPayload(payload: SentPayload) {
  ws.send(JSON.stringify(payload));
}

function handlePayload(receivedPayload: ReceivedPayload) {
  console.log(receivedPayload);
  if (receivedPayload.op === 0) {
    state.lastSequenceNumber = receivedPayload.s;
  } else if (receivedPayload.op === 10) {
    setInterval(() => sendPayload(buildHeartbeatPayload()), receivedPayload.d.heartbeat_interval);
    sendPayload(identifyPayload);
  }
}
ws.addEventListener("message", (ev: MessageEvent<string>) => {
  const payload = receivedPayloadSchema.safeParse(ev.data);
  if(payload.success) {
    handlePayload(payload.data)
  }
});
