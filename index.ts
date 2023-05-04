import z from 'zod';

const discordUrl = process.env.DISCORD_URL;
const discordToken = process.env.DISCORD_TOKEN;

const opcodeSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]).brand<'Opcode'>();

type Opcode = z.infer<typeof opcodeSchema>;

// https://discord.com/developers/docs/topics/gateway#get-gateway-bot-json-response
const gatewaySchema = z.object({
  url: z.string(),
  shards: z.number(),
  session_start_limit: z.object({
    total: z.number(),
    remaining: z.number(),
    reset_after: z.number(),
    max_concurrency: z.number(),
  }),
}).brand<'Gateway'>();

const response = await fetch(`${discordUrl}/gateway/bot`, { headers: { 'Authorization': `Bot ${discordToken}` } });
const gatewayUrl = `${gatewaySchema.parse((await response.json())).url}/?v=10&encoding=json`;

// https://discord.com/developers/docs/topics/gateway-events#payload-structure
const payloadSchema = z.object({
  op: opcodeSchema,
  d: z.object({}).nullable(),
  s: z.number().nullable(),
  t: z.string().nullable(),
}).brand<'Payload'>();

type Payload = z.infer<typeof payloadSchema>;

const ws = new WebSocket(gatewayUrl);

ws.addEventListener('message', (ev: MessageEvent<string>) => {
  const payload = payloadSchema.safeParse(JSON.parse(ev.data));
});
