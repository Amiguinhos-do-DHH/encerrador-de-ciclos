import z from "zod";
import { snowflakeSchema } from "@discord";

// https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
export const roleTagsSchema = z.object({
  bot_id: snowflakeSchema.optional(),
  integration_id: snowflakeSchema.optional(),
  premium_subscriber: z.null().optional(),
  subscription_listing_id: snowflakeSchema.optional(),
  available_for_purchase: z.null().optional(),
  guild_connections: z.null().optional(),
});
