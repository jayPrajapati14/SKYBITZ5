const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value === "") return true; // Treat empty string as empty
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && value !== null && Object.keys(value).length === 0) return true;
  return false;
};

export function isFiltersEqual<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
  // Helper function to check if a value is "empty"
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of allKeys) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // Skip if both values are empty
    if (isEmpty(val1) && isEmpty(val2)) {
      continue;
    }

    // If one is empty and the other isn't, objects are not equal
    if (isEmpty(val1) !== isEmpty(val2)) {
      return false;
    }

    // Handle nested objects
    if (
      typeof val1 === "object" &&
      typeof val2 === "object" &&
      val1 !== null &&
      val2 !== null &&
      !Array.isArray(val1) &&
      !Array.isArray(val2)
    ) {
      if (!isFiltersEqual(val1 as Record<string, unknown>, val2 as Record<string, unknown>)) {
        return false;
      }
    }
    // Handle arrays
    else if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) {
        return false;
      }
      for (let i = 0; i < val1.length; i++) {
        if (val1[i] !== val2[i]) {
          return false;
        }
      }
    }
    // Handle primitive values
    else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}
