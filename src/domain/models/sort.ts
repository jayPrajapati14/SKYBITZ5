declare global {
  type SortDirection = "asc" | "desc";

  type SortByModel<T> = {
    field: keyof T;
    sort: SortDirection;
  };
}
