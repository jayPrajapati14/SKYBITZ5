import { DAYS } from "@/domain/contants/days";

export function getDayByIndex(index: number): DayInfo {
  return DAYS[index];
}
