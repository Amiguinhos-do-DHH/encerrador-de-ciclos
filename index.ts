import z from 'zod';

const discordUrl = process.env.DISCORD_URL;
const discordToken = process.env.DISCORD_TOKEN;

// TODO: Roberto - Separar arquivos

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

const activitySchema = z.object({ // TODO: Marco vai consertar isso aqui
  name: z.string(),
  type: z.number(),
  url: z.string().nullable().optional(),
  created_at: z.number(),
  timestamps: z.date().nullable(),
  application_id: z.number().nullable(),
  details: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  emoji: z.object({}).nullable().optional(),
  party: z.object({}).nullable().optional(),
  assets: z.object({}).nullable().optional(),
  secrets: z.object({}).nullable().optional(),
  instance: z.boolean().nullable().optional(),
  flags: z.number().optional(),
  buttons: z.array(z.any()).optional()
})

const gatewayPresenceUpdateSchema = z.object({
  since: z.number().nullable(),
  // activies: z.array(), // TODO: Marco
  status: z.string(),
  afk: z.boolean()
})

const sentPayloadSchema = z.discriminatedUnion('op', [
  z.object({
    op: z.literal(2),
    d: z.object({
      token: z.string(),
      properties: z.object({
        os: z.string(),
        browser: z.string(),
        device: z.string()
      }),
      compress: z.boolean().nullable(),
      large_threshold: z.number().min(50).max(250).nullable(),
      shard: z.array(z.number()).length(2).nullable(),
      // TODO: presence // Davide
    })
  })
])

const receivedPayloadSchema = z.discriminatedUnion('op', [
  z.object({
    op: z.literal(0), // dispatch
    d: z.object({}),
    s: z.number(),
    t: z.string()
  }),
  z.object({
    op: z.literal(10), // hello
    d: z.object({
      heartbeat_interval: z.number()
    }),
    s: z.null(),
    t: z.null(),
  }),
])

type Payload = z.infer<typeof receivedPayloadSchema>;

const ws = new WebSocket(gatewayUrl);

ws.addEventListener('message', (ev: MessageEvent<string>) => {
  const payload = receivedPayloadSchema.safeParse(JSON.parse(ev.data));
});
