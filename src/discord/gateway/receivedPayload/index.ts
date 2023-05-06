import z from 'zod';
import { messageReactionAddSchema } from './messageReactionAdd';
import { helloSchema } from './hello';

export const receivedPayloadSchema = z
  .string()
  .transform((val, ctx) => {
    try {
      return JSON.parse(val);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Invalid JSON",
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .pipe(z.discriminatedUnion("op", [messageReactionAddSchema, helloSchema])).brand<"ReceivedPayload">();

export type ReceivedPayload = z.infer<typeof receivedPayloadSchema>;
