import { LocationRepository } from "@/infrastructure/repositories";

/**
 * Get countries
 * @returns The countries with states information
 */
export function getCountries(): Promise<CountryWithStates[]> {
  return LocationRepository.getCountries();
}
