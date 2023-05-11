import type { SentPayload } from "@discord/gateway/sentPayload";

export function sendPayload(ws: WebSocket, payload: SentPayload) {
  ws.send(JSON.stringify(payload));
}
