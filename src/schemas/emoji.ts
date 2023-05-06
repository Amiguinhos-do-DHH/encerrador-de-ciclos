import z from "zod";
import { roleSchema } from "./role.ts";
import { snowflakeSchema } from "./snowflake.ts";
import { userSchema } from "./user.ts";

export const emojiSchema = z.object({
  id: snowflakeSchema.nullable(),
  name: z.string().nullable(),
  roles: z.array(roleSchema).optional(),
  user: userSchema.optional(),
  require_colons: z.boolean().optional(),
  managed: z.boolean().optional(),
  animated: z.boolean().optional(),
  available: z.boolean().optional(),
});
