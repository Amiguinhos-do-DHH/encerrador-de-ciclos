import z from "zod";
import { emojiSchema } from "./emoji.ts";
import { memberSchema } from "./member.ts";
import { snowflakeSchema } from "./snowflake.ts";

export const messageReactionAddSchema =  z.object({
  op: z.literal(0),
  d: z.object({
    user_id: snowflakeSchema,
    channel_id: snowflakeSchema,
    message_id: snowflakeSchema,
    guild_id: snowflakeSchema.optional(),
    member: memberSchema.optional(),
    emoji: emojiSchema,
  }),
  s: z.number(),
  t: z.literal('MESSAGE_REACTION_ADD'),
})
