import { dayjs } from "@/infrastructure/dayjs/dayjs";

/**
 * Convert a date to a human-readable string
 * @param date - The date to convert
 * @returns A string in the format "MM/DD/YYYY, HH:MM AM/PM"
 */
export function dateFormatter(date: Date, timezone?: string | null): string {
  timezone = timezone ?? dayjs.tz.guess();

  const dateString = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: timezone,
  });
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
  return `${dateString}, ${timeString}`;
}

/**
 * Format a date to a relative time string
 * @param date - The date to convert
 * @returns A string representing the relative time
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInDays = Math.floor(diffInSeconds / 86400);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "a few seconds ago";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }
}

/**
 * Get a human-readable label for the last reported time
 * @param lastReported - The last reported time in days
 * @returns A string representing the last reported time
 */
export function getLastReportedLabel(lastReported?: number): string {
  if (!lastReported) return "No Last Reported";
  if (lastReported === 7) return "Last week";
  if (lastReported === 14) return "Last 2 weeks";
  if (lastReported === 21) return "Last 3 weeks";
  if (lastReported === 30) return "Last month";
  return `Last ${lastReported} days`;
}

/**
 * Get a human-readable label for the date range
 * @param dateRange - The date range to convert
 * @returns A string representing the date range
 */
export function getDateRangeLabel(dateRange?: { from: Date; to: Date }): string {
  if (!dateRange || !dateRange.from || !dateRange.to) return "No date range";
  return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
}

/**
 * Get a human-readable label for the idle time
 * @param idleTime - The idle time in hours
 * @returns A string representing the idle time
 */
export function getIdleTimeLabel(idleTime?: number): string {
  if (!idleTime) return "No idle time";

  if (idleTime === 4) return "Idle 4 hours";
  if (idleTime === 12) return "Idle 12 hours";
  if (idleTime === 24) return "Idle 1 day";
  if (idleTime === 168) return "Idle 1 week";
  if (idleTime === 720) return "Idle 1 month";

  return `Idle ${idleTime} hours`;
}

/**
 * Get a human-readable label for the time period
 * @param hours - The time period in hours
 * @returns A string representing the time period
 */

export const formatTimePeriod = (hours: number): string => {
  const days = Math.floor(hours / 24);
  const formattedHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours - Math.floor(hours)) * 60);

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${formattedHours}h `;
  if (minutes > 0 && (days === 0 || hours === 0)) result += `${minutes}m`;

  return result.trim();
};

/**
 * Generates a date range with timezone-adjusted start and end dates.
 * @param timezone - Timezone string
 * @param from - Optional start date as string or Date (defaults to 7 days ago)
 * @param to - Optional end date as string or Date (defaults to today)
 * @param defaultDaysBack - Number of days to subtract for default start date (default: 7)
 * @returns Object with from and to dates set to start and end of day in the given timezone
 */

export function getDateRange(
  timezone: string,
  from?: string | Date,
  to?: string | Date,
  defaultDaysBack: number = 7
): {
  from: Date;
  to: Date;
} {
  // 1. Start date at 00:00
  // 2. End date at 23:59:59
  // 3. Convert from user timezone to UTC
  return {
    from: dayjs(from || new Date(new Date().setDate(new Date().getDate() - defaultDaysBack)))
      .tz(timezone, true)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate(),
    to: dayjs(to || new Date())
      .tz(timezone, true)
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999)
      .toDate(),
  };
}
