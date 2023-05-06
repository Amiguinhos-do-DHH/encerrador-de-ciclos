import z from "zod";

export const helloSchema = z.object({
  op: z.literal(10),
  d: z.object({
    heartbeat_interval: z.number(),
  }),
  s: z.null(),
  t: z.null(),
});
