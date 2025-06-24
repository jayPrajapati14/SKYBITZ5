import { z } from "zod";

export const LandmarkTypeDtoSchema = z
  .object({
    geoTypeID: z.number(),
    name: z.string(),
  })
  .describe("LandmarkTypeDto");

export const LandmarkGroupDtoSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .describe("LandmarkGroupDto");

export const LandmarkDtoSchema = z
  .object({
    id: z.number(),
    name: z.string(),

    // Not part of this response, but useful for the UI
    typeId: LandmarkTypeDtoSchema.shape.geoTypeID.optional(),
    groupId: z.number().optional(),
  })
  .describe("LandmarkDto");

export const LandmarkPayloadSchema = z
  .object({
    id: z.array(z.number()),
  })
  .describe("LandmarkPayloadDto");

export const LandmarkAssetStatsDtoSchema = z
  .object({
    landmarkID: z.number(),
    landmarkName: z.string(),
    totalAssetsCount: z.number(),
    emptyAssetsCount: z.number(),
    lat: z.number(),
    longt: z.number(),
  })
  .describe("LandmarkAssetStatsDto");

export type LandmarkDto = z.infer<typeof LandmarkDtoSchema>;
export type LandmarkTypeDto = z.infer<typeof LandmarkTypeDtoSchema>;
export type LandmarkGroupDto = z.infer<typeof LandmarkGroupDtoSchema>;
export type LandmarkPayloadDto = z.infer<typeof LandmarkPayloadSchema>;
export type LandmarkAssetStatsDto = z.infer<typeof LandmarkAssetStatsDtoSchema>;
