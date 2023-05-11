import { describe, expect, test } from "bun:test";
import { intents, calculateIntents } from "./intents";

describe("calculateIntents", () => {
  test("returns bitwise OR", () => {
    expect(calculateIntents([intents.Guilds, intents.GuildMembers, intents.GuildMessageReactions])).toEqual(1027);
  });
});
