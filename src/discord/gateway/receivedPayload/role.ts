import z from "zod";
import { snowflakeSchema } from "@discord";
import { roleTagsSchema } from "./roleTags";

export const roleSchema = z.object({
  id: snowflakeSchema,
  name: z.string(),
  color: z.number(),
  hoist: z.boolean(),
  icon: z.string().nullable().optional(),
  unicode_emoji: z.string().nullable().optional(),
  position: z.number(),
  permissions: z.string(),
  managed: z.boolean(),
  mentionable: z.boolean(),
  tags: roleTagsSchema.optional(),
});
