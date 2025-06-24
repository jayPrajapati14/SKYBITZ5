import { apiFetch } from "@/infrastructure/api-fetch/api-fetch";
import { CountryDto, CountryDtoSchema } from "./location-dto";
import { zodParseArray } from "@/infrastructure/zod-parse/zod-parse";

/**
 * Get countries
 * @returns The countries with states information
 */
export async function getCountries(): Promise<CountryWithStates[]> {
  const url = "/api/v1/ref/country-and-state";
  const countries = await apiFetch<CountryDto[]>(url);
  const parsedCountries = zodParseArray(CountryDtoSchema, countries);
  return parsedCountries.map((country) => ({
    id: country.abbreviation,
    name: country.name,
    states: country.states.map((state) => ({
      id: state.abbreviation,
      name: state.name,
    })),
  }));
}
