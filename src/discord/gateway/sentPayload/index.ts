export type SentPayload = {
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

export { buildIdentifyPayload } from "./identify";

export { buildHeartbeatPayload } from "./heartbeat";
