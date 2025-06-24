/**
 * Metadata passed from the services to repositories
 * This is used to pass additional information from the services to the repositories without
 * needing to add infrastructure specific parameters to the domain layer
 *
 * For example, an abort signal can be passed to the repository to abort the request
 *
 * @example
 * const metadata = {
 *   signal: AbortSignal.timeout(1000),
 * };
 */
export type Metadata = Record<string, unknown>;
