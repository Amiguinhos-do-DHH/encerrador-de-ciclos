import z from "zod";

// https://discord.com/developers/docs/topics/gateway#get-gateway-bot-json-response
export const gatewaySchema = z
  .object({
    url: z.string(),
    shards: z.number(),
    session_start_limit: z.object({
      total: z.number(),
      remaining: z.number(),
      reset_after: z.number(),
      max_concurrency: z.number(),
    }),
  })
  .brand<"Gateway">();
