import z from "zod";
import { emojiSchema } from "./emoji";
import { memberSchema } from "./member";
import { snowflakeSchema } from "@discord";

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
