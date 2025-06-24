import { useGlobalStyles } from "@/hooks/use-global-styles";
import { dayjs } from "@/infrastructure/dayjs/dayjs";
import { CheckCircle } from "@mui/icons-material";
import RSuiteDateRangePicker, { DateRange, DisabledDateFunction } from "rsuite/DateRangePicker";
import "rsuite/DateRangePicker/styles/index.css";

type DateRangePickerProps = {
  range: { startDate: Date; endDate: Date } | null;
  onChange: (value: { startDate: Date; endDate: Date }) => void;
  placeholder?: string;
  placement?: "left" | "right";
};

function renderValue([start, end]: DateRange) {
  return (
    start.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) +
    " — " +
    end.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
  );
}

export function DateRangePicker({ range, onChange, placeholder, placement = "left" }: DateRangePickerProps) {
  useGlobalStyles(
    "date-range-picker",
    `
        :root {
          --rs-close-button-hover-color: black !important;
          --rs-btn-subtle-text: var(--rs-gray-800) !important;
          --rs-btn-subtle-hover-bg: transparent !important;
          --rs-btn-subtle-hover-text: var(--rs-gray-800) !important;
          --rs-btn-subtle-active-bg: transparent !important;
          --rs-btn-subtle-active-text: var(--rs-gray-800) !important;
        }
        .rs-picker-popup { z-index: 9999 }
        .rs-input { font-size: 14px !important; padding-left: 12px !important }
        .rs-input::placeholder { color: #aaa !important }
        .selected .rs-input { padding-left: 38px !important }
        .rs-input-group { border-color: #e5e7eb !important }
        .rs-input-group:hover { border-color: #000 !important }
        .rs-input-group:focus-within { border-color: none !important; outline: none !important }
        .rs-calendar-table-cell-disabled * { color: #ccc !important }
        .rs-calendar-header-error { color: #343434 !important }
        .rs-calendar-header-error:hover { background-color: transparent !important }
        .rs-calendar-header-title { color: #343434 !important }
    `
  );

  const handleChange = (value: DateRange | null) => {
    if (!value) return;

    onChange({
      startDate: value[0],
      endDate: value[1],
    });
  };

  const value = range ? ([range.startDate, range.endDate] as DateRange) : null;

  const shouldDisableDate: DisabledDateFunction = (date, selectDate, selectedDone, _target) => {
    const now = new Date();
    if (date.getTime() > now.getTime()) return true;

    if (selectedDone) return false;

    if (selectDate) {
      const diff = Math.abs(dayjs(date).diff(dayjs(selectDate[0]), "day"));
      // Do not allow more than 31 days
      if (diff > 31) return true;
      // Do not allow select the same day
      if (diff < 1) return true;
    }

    return false;
  };

  return (
    <div className="tw-relative tw-w-full">
      {value ? (
        <CheckCircle color="secondary" fontSize="small" className="tw-absolute tw-left-[14px] tw-top-[11px] tw-z-10" />
      ) : null}
      <RSuiteDateRangePicker
        block
        cleanable={false}
        showHeader={false}
        placement={placement === "left" ? "bottomStart" : "bottomEnd"}
        format="MM/dd/yyyy"
        renderValue={renderValue}
        character=" — "
        size="lg"
        className={value ? "selected" : ""}
        ranges={[
          {
            label: "Last Week",
            value: [
              dayjs().subtract(1, "week").startOf("week").toDate(),
              dayjs().subtract(1, "week").endOf("week").toDate(),
            ],
          },
          {
            label: "Last 7 Days",
            value: [dayjs().subtract(7, "day").startOf("day").toDate(), dayjs().endOf("day").toDate()],
          },
          {
            label: "Last Month",
            value: [
              dayjs().subtract(1, "month").startOf("month").toDate(),
              dayjs().subtract(1, "month").endOf("month").toDate(),
            ],
          },
        ]}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        shouldDisableDate={shouldDisableDate}
        showOneCalendar={true}
      />
    </div>
  );
}
