import { describe, expect, it } from "vitest";
import { recurrenceSentence } from "./recurrence-sentence";

describe("recurrenceSentence", () => {
  it("should handle hourly recurrence", () => {
    expect(recurrenceSentence({ frequency: "HOURLY", interval: 1 } as Recurrence)).toBe("hourly");
    expect(recurrenceSentence({ frequency: "HOURLY", interval: 2 } as Recurrence)).toBe("every 2 hours");
  });

  it("should handle daily recurrence", () => {
    expect(recurrenceSentence({ frequency: "DAILY", interval: 1 } as Recurrence)).toBe("daily");
    expect(recurrenceSentence({ frequency: "DAILY", interval: 3 } as Recurrence)).toBe("every 3 days");
  });

  it("should handle weekly recurrence", () => {
    expect(
      recurrenceSentence({
        frequency: "WEEKLY",
        interval: 1,
        days: [0, 2, 4],
      } as RecurrenceWeekly)
    ).toBe("weekly on Monday, Wednesday, and Friday");

    expect(
      recurrenceSentence({
        frequency: "WEEKLY",
        interval: 2,
        days: [0, 1, 2, 5],
      } as RecurrenceWeekly)
    ).toBe("every 2 weeks on Monday, Tuesday, Wednesday, and Saturday");
  });

  it("should handle monthly recurrence", () => {
    expect(
      recurrenceSentence({
        frequency: "MONTHLY",
        interval: 1,
        ordinal: 1,
        day: 1,
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
        time: "09:00",
        timezone: "UTC",
      } as Recurrence)
    ).toBe("monthly on the first Tuesday");

    expect(
      recurrenceSentence({
        frequency: "MONTHLY",
        interval: 2,
        ordinal: 5,
        day: 5,
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
        time: "09:00",
        timezone: "UTC",
      } as Recurrence)
    ).toBe("every 2 months on the last Saturday");
  });

  it("should handle yearly recurrence", () => {
    expect(
      recurrenceSentence({
        frequency: "YEARLY",
        interval: 1,
        ordinal: 2,
        day: 1,
        months: [3],
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
        time: "09:00",
        timezone: "UTC",
      } as RecurrenceYearly)
    ).toBe("annually on the second Tuesday of April");

    expect(
      recurrenceSentence({
        frequency: "YEARLY",
        interval: 2,
        ordinal: 2,
        day: 5,
        months: [0, 11],
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
        time: "09:00",
        timezone: "UTC",
      } as RecurrenceYearly)
    ).toBe("every 2 years on the second Saturday of January and December");
  });

  it("should handle non-recurring events", () => {
    expect(recurrenceSentence({ frequency: "ONCE" } as Recurrence)).toBe("Does not repeat");
  });
});
