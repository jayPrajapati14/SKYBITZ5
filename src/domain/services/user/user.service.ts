import { UserRepository } from "@/infrastructure/repositories";

/**
 * Get the current user's ID
 * @returns The current user's ID
 */
export function getCurrentUserId() {
  return UserRepository.getCurrentUserId();
}

/**
 * Get the current user
 * @returns The current user
 */
export function getCurrentUser(): Promise<User> {
  return UserRepository.getCurrentUser();
}

/**
 * extends the current user session
 * @returns void
 */
export function extendCurrentSession(): Promise<void> {
  return UserRepository.extendCurrentSession();
}
