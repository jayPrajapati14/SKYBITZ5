declare global {
  type DayShort = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  type DayLong = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

  type DayInfo = {
    long: DayLong;
    short: DayShort;
  };
}
