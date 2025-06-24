import { CheckCircle } from "@mui/icons-material";
import { Select, MenuItem, IconButton } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";

type SingleSelectProps<TOption> = {
  value: TOption | undefined;
  options: Array<{
    value: TOption;
    label: string;
  }>;
  emptyLabel?: string;
  onChange: (value: TOption) => void;
  onClear?: () => void;
  disabled?: boolean;
  defaultOpen?: boolean;
};

export function SingleSelect<TOption extends number | string>({
  value,
  options,
  emptyLabel,
  onChange,
  onClear,
  disabled,
  defaultOpen = false,
}: SingleSelectProps<TOption>) {
  // MUI Select requires a value, if not it will think it's a non-controlled component
  const selectValue = value ?? "";

  return (
    <Select
      defaultOpen={defaultOpen}
      disabled={disabled}
      size="small"
      labelId="idle-time-label"
      id="idle-time"
      value={selectValue ?? ""}
      onChange={(event) => onChange(event.target.value as TOption)}
      startAdornment={value ? <CheckCircle color="secondary" fontSize="small" className="tw-mr-1.5" /> : null}
      displayEmpty
      renderValue={
        value === undefined ? () => <span className="tw-text-gray-400">{emptyLabel ?? "Empty"} </span> : undefined
      }
      endAdornment={
        value && onClear && !disabled ? (
          <IconButton
            disabled={disabled}
            className="endAdornment"
            size="small"
            onClick={onClear}
            sx={{
              position: "absolute",
              right: "28px",
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ) : null
      }
      sx={{
        "&": { minHeight: 40 },
        "& .MuiIconButton-root": { opacity: 0 },
        "&:hover .MuiIconButton-root": { opacity: 1 },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
