import z from 'zod';

const payloadSchema = z.object({
  op: z.number(),
})

type Payload = z.infer<typeof payloadSchema>

console.log(payloadSchema.safeParse({op: 10}))
