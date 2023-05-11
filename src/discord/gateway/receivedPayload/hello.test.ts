import { describe, expect, test } from "bun:test";
import { helloSchema } from "./hello";

describe("helloSchema", () => {
  const helloPayload = {
    op: 10,
    d: {
      heartbeat_interval: 41250,
    },
    s: null,
    t: null,
  };

  const invalidHelloPayload = {
    op: 9,
    d: {
      heartbeat_interval: "41250",
    },
    s: null,
    t: 1,
  };

  test("accepts valid payload", () => {
    expect(() => helloSchema.parse(helloPayload)).not.toThrow();
  });

  test("raises error when receiving invalid payload", () => {
    expect(() => helloSchema.parse(invalidHelloPayload)).toThrow(
      '[\n  {\n    "received": 9,\n    "code": "invalid_literal",\n    "expected": 10,\n    "path": [\n      "op"\n    ],\n    "message": "Invalid literal value, expected 10"\n  },\n  {\n    "code": "invalid_type",\n    "expected": "number",\n    "received": "string",\n    "path": [\n      "d",\n      "heartbeat_interval"\n    ],\n    "message": "Expected number, received string"\n  },\n  {\n    "code": "invalid_type",\n    "expected": "null",\n    "received": "number",\n    "path": [\n      "t"\n    ],\n    "message": "Expected null, received number"\n  }\n]'
    );
  });
});
