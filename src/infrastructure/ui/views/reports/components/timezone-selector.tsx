import { TextField, MenuItem, useTheme } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import { CompoundInput } from "@/components/compound-inputs";
import { AccessTime } from "@mui/icons-material";
import { generateTimeSlots } from "../utils/generate-time-slots";
import moment from "moment-timezone";

const TIMEZONES = moment.tz.names().map((name: string) => {
  const now = moment().tz(name);
  return {
    name: name,
    offset: now.utcOffset() / 60, // Convert minutes to hours
  };
});

const TIME_SLOTS = generateTimeSlots();

const INPUT_SX = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const MENU_PROPS = {
  style: {
    maxHeight: "350px",
  },
};

type TimezoneSelectorProps = {
  label: string;
  time: string;
  timeZone?: Nullable<string>;
  onChangeTime: (value: string) => void;
  onChangeTimeZone: (value: string) => void;
};

function getNextAvailableTimeSlot(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  let hour: number = parseInt(hourStr, 10);
  let minute: number = parseInt(minuteStr, 10);

  minute = Math.ceil(minute / 15) * 15;
  if (minute === 60) {
    minute = 0;
    hour = (hour + 1) % 24;
  }

  const nextTimeSlot: string = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  return nextTimeSlot;
}

export function TimeZoneSelector({ label, time, timeZone, onChangeTime, onChangeTimeZone }: TimezoneSelectorProps) {
  const theme = useTheme();

  const selectedTimeSlot = getNextAvailableTimeSlot(time);

  return (
    <CompoundInput>
      <CompoundInput.Left>
        <TextField
          fullWidth
          value={selectedTimeSlot}
          select
          label={label}
          onChange={(e) => onChangeTime(e.target.value)}
          sx={INPUT_SX}
          slotProps={{
            inputLabel: {
              style: {
                padding: "0px 4px",
                backgroundColor: theme.palette.background.paper,
              },
            },
            select: {
              IconComponent: AccessTime,
              MenuProps: MENU_PROPS,
            },
          }}
        >
          {TIME_SLOTS.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </CompoundInput.Left>
      <CompoundInput.Right>
        <TextField
          fullWidth
          value={timeZone ?? ""}
          select
          label="Time Zone"
          onChange={(e) => onChangeTimeZone(e.target.value)}
          sx={INPUT_SX}
          slotProps={{
            inputLabel: {
              style: {
                padding: "0px 4px",
                backgroundColor: theme.palette.background.paper,
              },
            },
            select: {
              renderValue: (value) => {
                const timeZone = TIMEZONES.find((tz) => tz.name === value);
                return timeZone ? `(GMT ${timeZone.offset})` : (value as string);
              },
              IconComponent: PublicIcon,
              MenuProps: MENU_PROPS,
            },
          }}
        >
          {TIMEZONES.map((timeZone) => (
            <MenuItem key={timeZone.name} value={timeZone.name}>
              (GMT {timeZone.offset}) {timeZone.name}
            </MenuItem>
          ))}
        </TextField>
      </CompoundInput.Right>
    </CompoundInput>
  );
}
