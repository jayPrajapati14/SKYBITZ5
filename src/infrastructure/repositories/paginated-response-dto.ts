import { z } from "zod";

export const createPaginatedResponseSchema = <ItemType extends z.ZodTypeAny>(itemSchema: ItemType) => {
  return z.object({
    totalRecords: z.number(),
    pageSize: z.number(),
    pageNumber: z.number(),
    data: z.array(itemSchema),
  });
};
