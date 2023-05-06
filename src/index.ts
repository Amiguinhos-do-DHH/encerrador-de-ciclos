import z from "zod";
import { identifySchema, gatewaySchema, dispatchSchema, helloSchema } from "./schemas/index.ts";

const discordUrl = process.env.DISCORD_URL;
const discordToken = process.env.DISCORD_TOKEN;
const response = await fetch(`${discordUrl}/gateway/bot`, { headers: { Authorization: `Bot ${discordToken}` } });
const jsonResponse = await response.json();
const gatewayUrl = `${gatewaySchema.parse(jsonResponse).url}/?v=10&encoding=json`;

const sentPayloadSchema = z.discriminatedUnion("op", [identifySchema]).brand<"SentPayload">();
type SentPayload = z.infer<typeof sentPayloadSchema>;

const receivedPayloadSchema = z
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
  .pipe(z.discriminatedUnion("op", [dispatchSchema, helloSchema]).brand<"ReceivedPayload">());
type ReceivedPayload = z.infer<typeof receivedPayloadSchema>;

const ws = new WebSocket(gatewayUrl);
ws.addEventListener("message", (ev: MessageEvent<string>) => {
  const payload = receivedPayloadSchema.safeParse(ev.data);
  console.log(payload);
});
