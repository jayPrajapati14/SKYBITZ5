import { TextField, MenuItem } from "@mui/material";
import { DAYS } from "@/domain/contants/days";

const OCCURRENCES = ["first", "second", "third", "fourth", "last"];

type OcurrenceSelector = {
  value: { day: number; ordinal: number };
  onChange: (value: { day: number; ordinal: number }) => void;
  className?: string;
};

const OccurenceSelector = ({ value, onChange, className }: OcurrenceSelector) => {
  return (
    <div className={`tw-flex tw-gap-2 ${className}`}>
      <TextField
        size="small"
        className="tw-w-1/2"
        select
        value={value.ordinal}
        onChange={(e) => onChange({ ...value, ordinal: parseInt(e.target.value) })}
        label="Week of month"
      >
        {OCCURRENCES.map((occurrence, index) => (
          <MenuItem key={occurrence} value={index + 1}>
            {occurrence}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        className="tw-w-1/2"
        select
        value={value.day}
        onChange={(e) => onChange({ ...value, day: parseInt(e.target.value) })}
        label="Day of week"
      >
        {DAYS.map((day, index) => (
          <MenuItem key={day.short} value={index}>
            {day.long}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default OccurenceSelector;
