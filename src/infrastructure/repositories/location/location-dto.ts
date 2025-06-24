import { z } from "zod";

export const CountryDtoSchema = z
  .object({
    code: z.number(),
    abbreviation: z.string(),
    name: z.string(),
    states: z.array(
      z.object({
        name: z.string(),
        abbreviation: z.string(),
      })
    ),
  })
  .describe("CountryDto");

export type CountryDto = z.infer<typeof CountryDtoSchema>;
