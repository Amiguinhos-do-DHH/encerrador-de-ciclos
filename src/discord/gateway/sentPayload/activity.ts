import z from "zod";

export const activitySchema = z
  .object({
    name: z.string(),
    type: z.number(),
    url: z.string().nullable().optional(),
    created_at: z.number(),
    timestamps: z.object({
      start: z.number().optional(),
      end: z.number().optional(),
    }),
    application_id: z.number().optional(),
    details: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    emoji: z
      .object({
        name: z.string(),
        id: z.string().optional(),
        animated: z.boolean().optional(),
      })
      .nullable()
      .optional(),
    party: z
      .object({
        id: z.string().optional(),
        size: z.array(z.number()).length(2).optional(),
      })
      .optional(),
    assets: z
      .object({
        large_image: z.string().optional(),
        large_text: z.string().optional(),
        small_image: z.string().optional(),
        small_text: z.string().optional(),
      })
      .optional(),
    secrets: z
      .object({
        join: z.string().optional(),
        spectate: z.string().optional(),
        match: z.string().optional(),
      })
      .optional(),
    instance: z.boolean().optional(),
    flags: z.number().optional(),
    buttons: z.array(z.any()).optional(),
  })
  .brand<"Activity">();
