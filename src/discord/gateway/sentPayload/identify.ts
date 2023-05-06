import type { SentPayload } from ".";

export function buildIdentifyPayload(token: string, intents: number): SentPayload {
  return {
    op: 2,
    d: {
      token: token,
      properties: {
        os: 'linux',
        browser: 'encerrador-de-ciclos',
        device: 'encerrador-de-ciclos',
      },
      intents: intents,
    },
  }
};
