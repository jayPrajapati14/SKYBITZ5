export const arrayFilterCount = <T extends unknown[]>(arr: T | undefined) => ((arr?.length ?? 0) > 0 ? 1 : 0);
export const scalarFilterCount = (str: boolean | string | number | undefined) => (str !== undefined ? 1 : 0);
export const objectFilterCount = (obj: Record<string, unknown> | undefined) => (obj ? 1 : 0);
