import z from "zod";

export const heartbeatSchema = z.object({
  op: z.literal(1),
  d: z.number(),
})
