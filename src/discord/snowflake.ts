import z from "zod";

export const snowflakeSchema = z.union([z.string(), z.number()]);
