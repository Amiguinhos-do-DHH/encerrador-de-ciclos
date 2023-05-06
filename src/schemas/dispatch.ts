import z from "zod";

export const dispatchSchema = z.object({
  op: z.literal(0),
  d: z.object({}),
  s: z.number(),
  t: z.string(),
});
