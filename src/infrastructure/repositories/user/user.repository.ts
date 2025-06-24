import { apiFetch, getCookie } from "@/infrastructure/api-fetch/api-fetch";
import { UserDto, UserDtoSchema } from "./user-dto";
import { zodParse } from "@/infrastructure/zod-parse/zod-parse";
import { getSessionExtendsUrl } from "@/domain/utils/url";

function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error("Time zones are not available in this environment");
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (error) {
    console.warn(`Invalid timezone: ${tz}`, error);
    return false;
  }
}

/**
 * Get the current user ID
 * @returns The current user ID
 */
export function getCurrentUserId() {
  return getCookie("udke");
}

/**
 * Get the current user
 * @returns The current user
 */
export async function getCurrentUser(): Promise<User> {
  const user = await apiFetch<UserDto>(`/api/v1/user/current`);
  const parsedUser = zodParse(UserDtoSchema, user);

  // If timezone is not provided or is invalid, use the browser's default timezone
  if (!parsedUser.preferredTimezone || !isValidTimeZone(parsedUser.preferredTimezone)) {
    parsedUser.preferredTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  return {
    id: parsedUser.userID,
    username: parsedUser.userName,
    email: parsedUser.email ?? "",
    type: parsedUser.userTypeName,
    customerId: parsedUser.customerID,
    firstName: parsedUser.firstName ?? "",
    lastName: parsedUser.lastName ?? "",
    timezone: parsedUser.preferredTimezone,
  };
}

export async function extendCurrentSession(): Promise<void> {
  const URL = getSessionExtendsUrl();
  return await apiFetch<void>(URL);
}
