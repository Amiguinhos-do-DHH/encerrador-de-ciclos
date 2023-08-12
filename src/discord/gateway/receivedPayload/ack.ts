import z from "zod";

export const ackSchema =  z.object({
  op: z.literal(11),
  d: z.null(),
  s: z.null(),
  t: z.null(),
})
