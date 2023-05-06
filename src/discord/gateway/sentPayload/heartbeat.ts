import type { SentPayload } from ".";

export function buildHeartbeatPayload(lastSequenceNumber: null | number): SentPayload {
  return {
    op: 1,
    d: lastSequenceNumber,
  }
}

