import z from "zod";
import { activitySchema } from "./activity";

export const gatewayPresenceUpdateSchema = z
  .object({
    since: z.number().nullable(),
    activities: z.array(activitySchema),
    status: z.string(),
    afk: z.boolean(),
  })
  .brand<"GatewayPresenceUpdate">();
