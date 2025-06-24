import { z } from "zod";

export const QuickSearchDtoSchema = z.object({
  id: z.number(),
  custAssetID: z.string().nullable(),
  type: z.string().nullable(),
  mtsn: z.string().nullable(),
  mtid: z.number().nullable(),
});

export const QuickSearchResponseSchema = z.object({
  assets: z.array(QuickSearchDtoSchema),
});

export type QuickSearchDto = z.infer<typeof QuickSearchDtoSchema>;
export type QuickSearchResponseDto = z.infer<typeof QuickSearchResponseSchema>;
