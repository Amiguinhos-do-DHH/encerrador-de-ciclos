import { describe, expect, test } from "bun:test";
import { gatewaySchema } from "./index";

describe("gatewaySchema", () => {
  const getGatewayBotPayload = {
    url: "wss://gateway.discord.gg",
    session_start_limit: {
      max_concurrency: 1,
      remaining: 995,
      reset_after: 81272520,
      total: 1000,
    },
    shards: 1,
  };

  const getGatewayBotPayloadInvalid = {
    url: "wss://gateway.discord.gg",
    session_start_limit: {
      max_concurrency: 1,
      reset_after: 81272520,
      total: 1000,
    },
    shards: "1",
  };

  test("accepts valid payload", () => {
    expect(() => gatewaySchema.parse(getGatewayBotPayload)).not.toThrow();
  });

  test("raises error when receiving invalid payload", () => {
    expect(() => gatewaySchema.parse(getGatewayBotPayloadInvalid)).toThrow(
      '[\n  {\n    "code": "invalid_type",\n    "expected": "number",\n    "received": "string",\n    "path": [\n      "shards"\n    ],\n    "message": "Expected number, received string"\n  },\n  {\n    "code": "invalid_type",\n    "expected": "number",\n    "received": "undefined",\n    "path": [\n      "session_start_limit",\n      "remaining"\n    ],\n    "message": "Required"\n  }\n]'
    );
  });
});
