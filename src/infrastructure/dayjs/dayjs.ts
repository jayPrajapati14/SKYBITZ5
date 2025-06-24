import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs, { type Dayjs } from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

export { dayjs, Dayjs };
