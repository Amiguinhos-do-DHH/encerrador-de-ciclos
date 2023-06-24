import { ZodError } from "zod";

export function parseZodError(zodError: ZodError) {
  return zodError.errors.reduce<Record<string, Array<string>>>((acc, val) => {
    if (Array.isArray(acc[val.path[0]])) {
      acc[val.path[0]] = [...acc[val.path[0]], val.message]
    } else {
      acc[val.path[0]] = [val.message];
    };

    return acc;
  }, {});
}
