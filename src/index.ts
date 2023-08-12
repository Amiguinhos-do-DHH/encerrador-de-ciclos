import z from "zod";
import { calculateIntents, intents } from "@discord/gateway";
import { receivedPayloadSchema, ReceivedPayload } from "@discord/gateway/receivedPayload";
import { buildHeartbeatPayload, buildIdentifyPayload } from "@discord/gateway/sentPayload";
import { sendPayload } from "@discord/gateway/helpers";
import { gatewaySchema } from "@discord/rest";

const envSchema = z.object({
  DISCORD_URL: z.string().startsWith("https://discord.com/api/"),
  DISCORD_TOKEN: z.string(),
});

const ENV = envSchema.parse({
  DISCORD_URL: Bun.env.DISCORD_URL,
  DISCORD_TOKEN: Bun.env.DISCORD_TOKEN,
});

const response = await fetch(`${ENV.DISCORD_URL}/gateway/bot`, {
  headers: { Authorization: `Bot ${ENV.DISCORD_TOKEN}` },
});
const jsonResponse = await response.json();
console.log(jsonResponse);
const gatewayUrl = `${gatewaySchema.parse(jsonResponse).url}/?v=10&encoding=json`;

type State = {
  lastSequenceNumber: number | null;
  reconnectIntervalTimer: Timer | null;
  heartbeatIntervalTimer: Timer | null;
  webSocket: WebSocket | null;
};

const state: State = {
  lastSequenceNumber: null,
  reconnectIntervalTimer: null,
  heartbeatIntervalTimer: null,
  webSocket: null,
};

function sendHeartbeat() {
  const heartbeatPayload = buildHeartbeatPayload(state.lastSequenceNumber);
  console.log(`Enviando heartbeat: ${heartbeatPayload.d}`);
  const time1 = new Date();
  console.log("time 1:", time1.toLocaleString('pt-BR'));
  if (state.webSocket) {
    sendPayload(state.webSocket, heartbeatPayload);
  }
}

function startHeartbeat(heartbeatInterval: number) {
  const jitter = Math.random();

  setTimeout(() => {
    state.reconnectIntervalTimer = setInterval(reconnect, heartbeatInterval);
    sendHeartbeat();
    state.heartbeatIntervalTimer = setInterval(sendHeartbeat, heartbeatInterval);
  }, heartbeatInterval * jitter);
}

function reconnect() {
  // todo: DHH vai refatorar os if's
  if (state.heartbeatIntervalTimer) {
    clearInterval(state.heartbeatIntervalTimer);
  }
  if (state.reconnectIntervalTimer) {
    clearInterval(state.reconnectIntervalTimer);
  }
  if (state.webSocket) {
    state.webSocket.close();
  }
  connect();
}

function connect() {
  state.webSocket = new WebSocket(gatewayUrl);
  state.webSocket.addEventListener("message", handleMessage);
}

function handlePayload(receivedPayload: ReceivedPayload) {
  // console.log(receivedPayload);
  state.lastSequenceNumber = receivedPayload.s;
  switch (receivedPayload.op) {
    // case 0:
      // todo: DHH vai refatorar o case 0 para quando tiver reações
    case 10:
      startHeartbeat(receivedPayload.d.heartbeat_interval);
      const identifyPayload = buildIdentifyPayload(ENV.DISCORD_TOKEN, calculateIntents([intents.GuildMessageReactions]));
      if (state.webSocket) {
        sendPayload(state.webSocket, identifyPayload);
      }
      break;
    case 11:
      if (state.reconnectIntervalTimer) {
        clearInterval(state.reconnectIntervalTimer);
      }
      break;
  }
}

function handleMessage(message: MessageEvent<string>) {
  const payload = receivedPayloadSchema.safeParse(message.data);
  console.log(message.data);
  const time2 = new Date();
  console.log("time 2:", time2.toLocaleString('pt-BR'));
  if (payload.success) {
    handlePayload(payload.data);
  }
}

connect();
