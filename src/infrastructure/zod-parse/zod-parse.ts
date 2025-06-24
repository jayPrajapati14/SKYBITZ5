import { APIError, ZOD_ERROR_CODE } from "@/infrastructure/errors/errors";
import { z, ZodSchema } from "zod";
import { ErrorData, sendNotification } from "../errors/logger";
import { getCookie } from "../api-fetch/api-fetch";

/**
 * Parses a single object using a Zod schema.
 * @param schema - The Zod schema to use for parsing.
 * @param dto - The object to parse.
 * @returns The parsed object.
 * @throws An APIError if the parsing fails.
 */
export const zodParse = <T>(schema: ZodSchema<T>, dto: unknown): T => {
  try {
    return schema.parse(dto);
  } catch (error) {
    if (!schema.description) {
      console.warn("No description provided for schema", schema);
    }
    notifyError(schema, error);
    throw new APIError(`Error parsing ${schema.description ?? "Unknown schema"}`, ZOD_ERROR_CODE, error);
  }
};

/**
 * Parses an array of objects using a Zod schema.
 * @param schema - The Zod schema to use for parsing.
 * @param dto - The array of objects to parse.
 * @returns The parsed array of objects.
 * @throws An APIError if the parsing fails.
 */
export const zodParseArray = <T>(schema: ZodSchema<T>, dto: unknown[]): T[] => {
  try {
    return z.array(schema).parse(dto);
  } catch (error) {
    notifyError(schema, error);
    throw new APIError(`Error parsing array of ${schema.description ?? "Unknown schema"}`, ZOD_ERROR_CODE, error);
  }
};

/*
  this method is used to send data to backend 
  API and trigger notification to UI team
*/

function notifyError(schema: ZodSchema, error: unknown): void {
  const customerId = getCookie("udke");
  const errorData: ErrorData = {
    message: "Parse Error",
    stack:
      (`Error parsing ${schema.description ?? "Unknown schema"}, ${error}` as string) || "No stack trace available",
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    customerId: (customerId ?? 0) as number,
  };
  sendNotification(errorData);
}
