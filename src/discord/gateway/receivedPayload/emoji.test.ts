import { describe, expect, test } from "bun:test";
import { emojiSchema } from "./emoji";

describe("emojiSchema", () => {
  const emojiPayload = {
    id: "41771983429993937",
    name: "LUL",
    roles: ["41771983429993000", "41771983429993111"],
    user: {
      username: "Luigi",
      discriminator: "0002",
      id: "96008815106887111",
      avatar: "5500909a3274e1812beb4e8de6631111",
      public_flags: 131328,
    },
    require_colons: true,
    managed: false,
    animated: false,
  };

  const invalidEmojiPayload = {
    id: "41771983429993937",
    name: "LUL",
    roles: "41771983429993000",
    user: {
      username: "Luigi",
      discriminator: "0002",
      id: "96008815106887111",
      avatar: "5500909a3274e1812beb4e8de6631111",
      public_flags: 131328,
    },
    require_colons: true,
    managed: false,
    animated: false,
  };

  test("accepts valid payload", () => {
    expect(() => emojiSchema.parse(emojiPayload)).not.toThrow();
  });

  test("raises error when receiving invalid payload", () => {
    expect(() => emojiSchema.parse(invalidEmojiPayload)).toThrow(
      '[\n  {\n    "code": "invalid_type",\n    "expected": "array",\n    "received": "string",\n    "path": [\n      "roles"\n    ],\n    "message": "Expected array, received string"\n  }\n]'
    );
  });
});
