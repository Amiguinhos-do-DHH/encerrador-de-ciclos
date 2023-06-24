import { describe, expect, test } from "bun:test";
import { userSchema } from "./user";
import { parseZodError } from "@helpers";

describe("userSchema", () => {
  test("accepts valid payload", () => {
    const userPayload = {
      id: "246610061789495296",
      username: "molvr",
      discriminator: "0",
      avatar: "dbb91d5901275308efbd727939eda1ea",
      bot: false,
      banner: "06c16474723fe537c283b8efa61a30c8",
      accent_color: 16711680,
      global_name: "mat",
      display_name: "mat",
      avatar_decoration: null,
      verified: true,
      email: "nelly@discord.com",
      flags: 64,
      premium_type: 1,
      public_flags: 256,
    };

    expect(() => userSchema.parse(userPayload)).not.toThrow();
  });

  test("raises error when receiving invalid payload", () => {
    const invalidUserPayload = {
      id: null,
      discriminator: null,
      avatar: "dbb91d5901275308efbd727939eda1ea",
      bot: false,
      banner: "06c16474723fe537c283b8efa61a30c8",
      accent_color: 16711680,
      global_name: "matdbb91d5901275308efbd727939eda1ea",
      display_name: "mat",
      avatar_decoration: null,
      verified: true,
      email: "nelly@discord.com",
      flags: 64,
      premium_type: 4,
      public_flags: 256,
    }

    const safeParsePayload = userSchema.safeParse(invalidUserPayload);

    expect(safeParsePayload.success).toBe(false);
    if (!safeParsePayload.success) {
      expect(parseZodError(safeParsePayload.error)).toEqual(
        {
          "id": [ "Invalid input" ],
          "username": [ "Required" ],
          "discriminator": [ "Expected string, received null" ],
          "global_name": [ "String must contain at most 32 character(s)" ],
          "premium_type": [ "Number must be less than or equal to 3" ]
        }
      );
    }
  });
});
