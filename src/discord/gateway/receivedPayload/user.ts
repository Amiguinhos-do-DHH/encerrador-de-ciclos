import z from "zod";
import { snowflakeSchema } from "@discord";

const localeSchema = z.union([
  z.literal('id'),        // Indonésio
  z.literal('da'),        // Dinamarquês
  z.literal('de'),        // Alemão
  z.literal('en-GB'),     // Inglês britânico
  z.literal('en-US'),     // Inglês estadunidense
  z.literal('es-ES'),     // Espanhol
  z.literal('fr'),        // Francês
  z.literal('hr'),        // Croata
  z.literal('it'),        // Italiano
  z.literal('hu'),        // Húngaro
  z.literal('nl'),        // Holandês
  z.literal('no'),        // Norueguês
  z.literal('pl'),        // Polonês
  z.literal('pt-BR'),     // Português brasileiro
  z.literal('ro'),        // Romeno
  z.literal('fi'),        // Finlandês
  z.literal('sv-SE'),     // Sueco
  z.literal('vi'),        // Vietnamita
  z.literal('tr'),        // Turco
  z.literal('cs'),        // Tcheco
  z.literal('el'),        // Grego
  z.literal('bg'),        // Búlgaro
  z.literal('ru'),        // Russo
  z.literal('uk'),        // Ucraniano
  z.literal('hi'),        // Hindi
  z.literal('th'),        // Tailandês
  z.literal('zh-CN'),     // Chinês chinês
  z.literal('ja'),        // Japonês
  z.literal('zh-TW'),     // Chinês taiwanês
  z.literal('ko'),        // Coreano
]);

export const userSchema = z.object({
  id: snowflakeSchema,
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  bot: z.boolean().optional(),
  system: z.boolean().optional(),
  global_name: z.string().max(32).nullable(),
  display_name: z.string().nullable(),
  avatar_decoration: z.any().nullable(), // TODO: botar tipo do bom quando a doc do discord atualizar
  mfa_enabled: z.boolean().optional(),
  banner: z.string().nullable().optional(),
  accent_color: z.number().nullable().optional(),
  locale: localeSchema.optional(),
  verified: z.boolean().optional(),
  email: z.string().nullable().optional(),
  flags: z.number().optional(),
  premium_type: z.number().min(0).max(3).optional(),
  public_flags: z.number().optional(),
});
