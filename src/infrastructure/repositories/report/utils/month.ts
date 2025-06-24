import { MONTHS } from "@/domain/contants/months";

export function getMonthByIndex(index: number): Month {
  return MONTHS[index];
}
