import z from 'zod';
import { ackSchema } from './ack';
import { helloSchema } from './hello';
import { messageReactionAddSchema } from './messageReactionAdd';

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
  .pipe(z.discriminatedUnion("op", [messageReactionAddSchema, helloSchema, ackSchema])).brand<"ReceivedPayload">();

export type ReceivedPayload = z.infer<typeof receivedPayloadSchema>;
