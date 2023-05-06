import z from "zod";
import { calculateIntents, intents } from "@discord/gateway";
import { receivedPayloadSchema, ReceivedPayload } from "@discord/gateway/receivedPayload";
import { gatewaySchema } from "@discord/rest";
import { SentPayload, buildHeartbeatPayload, buildIdentifyPayload } from "@discord/gateway/sentPayload";

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

const ws = new WebSocket(gatewayUrl);

type State = {
  lastSequenceNumber: number | null,
}

const state: State = {
  lastSequenceNumber: null,
}

function sendPayload(payload: SentPayload) {
  ws.send(JSON.stringify(payload));
}

function sendHeartbeat() {
  const heartbeatPayload = buildHeartbeatPayload(state.lastSequenceNumber);
  console.log(`Enviando heartbeat: ${heartbeatPayload.d}`)
  sendPayload(heartbeatPayload);
}

function startHeartbeat(heartbeatInterval: number) {
  const jitter = Math.random();

  setTimeout(() => {
    sendHeartbeat();
    setInterval(() => sendHeartbeat(), heartbeatInterval);
  }, heartbeatInterval * jitter);
}

function handlePayload(receivedPayload: ReceivedPayload) {
  console.log(receivedPayload);
  if (receivedPayload.op === 0) {
    state.lastSequenceNumber = receivedPayload.s;
  } else if (receivedPayload.op === 10) {
    startHeartbeat(receivedPayload.d.heartbeat_interval);
    const identifyPayload = buildIdentifyPayload(ENV.DISCORD_TOKEN, calculateIntents([intents.GuildMessageReactions]));
    sendPayload(identifyPayload);
  }
}

ws.addEventListener("message", (ev: MessageEvent<string>) => {
  const payload = receivedPayloadSchema.safeParse(ev.data);
  if (payload.success) {
    handlePayload(payload.data);
  }
});
