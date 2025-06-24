import { getDayByIndex } from "@/infrastructure/repositories/report/utils/day";
import { getMonthByIndex } from "@/infrastructure/repositories/report/utils/month";

const listFormatter = new Intl.ListFormat("en-US", {
  style: "long",
  type: "conjunction",
});

function getOrdinalLabel(n: number): string {
  if (n === 1) return "first";
  if (n === 2) return "second";
  if (n === 3) return "third";
  if (n === 4) return "fourth";
  if (n === 5) return "last";
  throw new Error(`Invalid ordinal number: ${n}`);
}

function getHourlyDescription(recurrence: Recurrence): string {
  return `${recurrence.interval > 1 ? `every ${recurrence.interval} hours` : "hourly"}`;
}

function getDailyDescription(recurrence: Recurrence): string {
  return `${recurrence.interval > 1 ? `every ${recurrence.interval} days` : "daily"}`;
}

function getWeeklyDescription(recurrence: RecurrenceWeekly): string {
  if (new Set(recurrence.days).size === 7) {
    return "every day";
  }
  if (new Set(recurrence.days).size === 5 && recurrence.days.every((day) => [1, 2, 3, 4, 5].includes(day))) {
    return "every weekday";
  }

  const dayNames = recurrence.days.map((day) => getDayByIndex(day).long);
  return `${recurrence.interval > 1 ? `every ${recurrence.interval} weeks` : "weekly"} on ${listFormatter.format(dayNames)}`;
}

function getMonthlyDescription(recurrence: RecurrenceMonthly): string {
  const day = getDayByIndex(recurrence.day);
  return `${recurrence.interval > 1 ? `every ${recurrence.interval} months` : "monthly"} on the ${getOrdinalLabel(recurrence.ordinal)} ${day.long}`;
}

function getYearlyDescription(recurrence: RecurrenceYearly): string {
  const day = getDayByIndex(recurrence.day);
  const months = recurrence.months.map((index) => getMonthByIndex(index).long);
  return `${recurrence.interval > 1 ? `every ${recurrence.interval} years` : "annually"} on the ${getOrdinalLabel(recurrence.ordinal)} ${day.long} of ${listFormatter.format(months)}`;
}

export function recurrenceSentence(recurrence: Recurrence): string {
  if (recurrence.frequency === "HOURLY") return getHourlyDescription(recurrence);
  if (recurrence.frequency === "DAILY") return getDailyDescription(recurrence);
  if (recurrence.frequency === "WEEKLY") return getWeeklyDescription(recurrence);
  if (recurrence.frequency === "MONTHLY") return getMonthlyDescription(recurrence);
  if (recurrence.frequency === "YEARLY") return getYearlyDescription(recurrence);
  return "Does not repeat";
}
