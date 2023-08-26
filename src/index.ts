import z from "zod";
import { calculateIntents, intents } from "@discord/gateway";
import { receivedPayloadSchema, ReceivedPayload } from "@discord/gateway/receivedPayload";
import { buildHeartbeatPayload, buildIdentifyPayload } from "@discord/gateway/sentPayload";
import { sendPayload } from "@discord/gateway/helpers";
import { gatewaySchema } from "@discord/rest";

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
});

const ENV = envSchema.parse({
  DISCORD_TOKEN: Bun.env.DISCORD_TOKEN,
});

const response = await fetch("https://discord.com/api/v10/gateway/bot", {
  headers: { Authorization: `Bot ${ENV.DISCORD_TOKEN}` },
});

const jsonResponse = await response.json();

const gatewayUrl = `${gatewaySchema.parse(jsonResponse).url}/?v=10&encoding=json`;

type State = {
  lastSequenceNumber: number | null;
  reconnectIntervalTimer: Timer | null;
  heartbeatIntervalTimer: Timer | null;
  webSocket: WebSocket | null;
  shouldReconnect: boolean;
};

const state: State = {
  lastSequenceNumber: null,
  reconnectIntervalTimer: null,
  heartbeatIntervalTimer: null,
  webSocket: null,
  shouldReconnect: true,
};

function connect() {
  state.webSocket = new WebSocket(gatewayUrl);
  state.webSocket.addEventListener("message", (message: MessageEvent<string>) => {
    const payload = receivedPayloadSchema.safeParse(message.data);
    console.log(message.data);
    if (payload.success) handlePayload(payload.data);
  });
  state.webSocket.addEventListener("close", reconnect);
}

function handlePayload(receivedPayload: ReceivedPayload) {
  switch (receivedPayload.op) {
    case 0:
      state.lastSequenceNumber = receivedPayload.s;
      break;
    case 10:
      startHeartbeat(receivedPayload.d.heartbeat_interval);
      const identifyPayload = buildIdentifyPayload(
        ENV.DISCORD_TOKEN,
        calculateIntents([intents.GuildMessageReactions])
      );
      if (state.webSocket) sendPayload(state.webSocket, identifyPayload);
      break;
    case 11:
      state.shouldReconnect = false;
      break;
  }
}

function startHeartbeat(heartbeatInterval: number) {
  const jitter = Math.random();
  setTimeout(() => {
    sendHeartbeat();
    state.reconnectIntervalTimer = setInterval(() => {
      if (state.shouldReconnect && state.webSocket) state.webSocket.close();
      state.shouldReconnect = true;
    }, heartbeatInterval);
    state.heartbeatIntervalTimer = setInterval(sendHeartbeat, heartbeatInterval);
  }, heartbeatInterval * jitter);
}

function sendHeartbeat() {
  const heartbeatPayload = buildHeartbeatPayload(state.lastSequenceNumber);
  console.log(`Enviando heartbeat: ${heartbeatPayload.d}`);
  if (state.webSocket) sendPayload(state.webSocket, heartbeatPayload);
}

function reconnect() {
  // todo: DHH vai refatorar os if's
  if (state.heartbeatIntervalTimer) clearInterval(state.heartbeatIntervalTimer);
  if (state.reconnectIntervalTimer) clearInterval(state.reconnectIntervalTimer);
  connect();
}

connect();
