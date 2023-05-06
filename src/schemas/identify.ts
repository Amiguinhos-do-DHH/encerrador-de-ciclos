import z from "zod";
import { gatewayPresenceUpdateSchema } from "./gatewayPresenceUpdate.ts";

export const identifySchema = z.object({
  op: z.literal(2),
  d: z.object({
    token: z.string(),
    properties: z.object({
      os: z.string(),
      browser: z.string(),
      device: z.string(),
    }),
    compress: z.boolean().optional(),
    large_threshold: z.number().min(50).max(250).optional(),
    shard: z.array(z.number()).length(2).optional(),
    presence: gatewayPresenceUpdateSchema.optional(),
    intents: z.number(),
  }),
});
