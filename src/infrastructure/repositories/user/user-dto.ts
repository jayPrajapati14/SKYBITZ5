import { z } from "zod";

export const UserDtoSchema = z.object({
  userID: z.number(),
  userName: z.string(),
  userTypeName: z.string(),
  customerID: z.number(),
  email: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  preferredTimezone: z.string().nullable(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;
