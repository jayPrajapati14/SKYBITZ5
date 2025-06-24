import { TextField, IconButton, debounce, TextFieldProps } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect, useMemo } from "react";
import { CONFIG } from "@/domain/config";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
  debounceMs?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
} & Omit<TextFieldProps, "value" | "onChange">;

export function Input({
  value,
  onChange,
  clear,
  debounceMs = CONFIG.defaultDebounceMs,
  startIcon,
  endIcon,
  ...rest
}: InputProps) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const hasValue = Boolean(inputValue && inputValue.length > 0);

  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        onChange(value);
      }, debounceMs),
    [onChange, debounceMs]
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedOnChange(newValue);
  };

  const clearFilter = () => {
    setInputValue("");
    clear();
  };

  useEffect(() => {
    return () => {
      debouncedOnChange.clear(); // Clear pending debounced calls on unmount
    };
  }, [debouncedOnChange]);

  return (
    <TextField
      {...rest}
      value={inputValue}
      onChange={onInputChange}
      size="small"
      slotProps={{
        input: {
          startAdornment: startIcon,
          endAdornment: hasValue ? (
            <IconButton size="small" onClick={clearFilter}>
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : (
            endIcon
          ),
        },
      }}
    />
  );
}
