export const unique = <T, K extends keyof T>(list: T[], key: K) =>
  list.reduce((acc, item) => {
    if (!acc.some((g) => g[key] === item[key])) {
      acc.push(item);
    }
    return acc;
  }, [] as T[]);
