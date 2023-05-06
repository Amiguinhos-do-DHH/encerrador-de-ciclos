import z from "zod";
import { userSchema } from "./user.ts";
import { snowflakeSchema } from "./snowflake.ts";

export const memberSchema = z.object({
  user: userSchema.optional(),
  nick: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  roles: z.array(snowflakeSchema),
  joined_at: z.string().datetime({ offset: true }),
  premium_since: z.string().datetime({ offset: true }).nullable().optional(),
  deaf: z.boolean(),
  mute: z.boolean(),
  flags: z.number(),
  pending: z.boolean().optional(),
  permissions: z.string().optional(),
  communication_disabled_until: z.string().datetime({ offset: true }).nullable().optional(),
});
