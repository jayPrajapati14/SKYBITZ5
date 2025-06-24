import {
  Autocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  Checkbox,
  Chip,
  CircularProgress,
  createFilterOptions,
  debounce,
  TextField,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { SyntheticEvent, useMemo, useState, useRef, useEffect } from "react";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { History } from "@mui/icons-material";
import { Metadata } from "@/domain/models/metadata";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="secondary" />;

const radioIcon = <RadioButtonUncheckedIcon fontSize="small" />;
const checkedRadioIcon = <RadioButtonCheckedIcon fontSize="small" color="secondary" />;

const loadingIcon = <CircularProgress color="inherit" size={20} />;

type AutocompleteProps<TOption> = Omit<
  MuiAutocompleteProps<TOption, true, false, false>,
  "renderInput" | "options" | "groupBy" | "renderGroup"
>;

type MultiSelectAsyncProps<TOption> = AutocompleteProps<TOption> & {
  getOptions: ((inputText: string, metadata: Metadata) => Promise<TOption[]>) | TOption[];
  getOptionId: (option: TOption) => string | number;
  getOptionLabel: (option: TOption) => string;
  groupBy?: (option: TOption) => string | undefined;
  getGroupLabel?: (group: string) => string | undefined;
  noOptionsText?: string;
  value?: TOption[];
  placeholder?: string;
  debounceMs?: number;
  onChange?: (event: SyntheticEvent<Element, Event> | null, value: TOption[], reason?: string) => void;
  defaultOptions?: TOption[];
  maxSelectedOptions?: number;
  permanentOptions?: (string | number)[];
};

export function MultiSelectAsync<TOption>({
  getOptions,
  getOptionId,
  getOptionLabel,
  groupBy,
  getGroupLabel,
  noOptionsText,
  placeholder,
  debounceMs = 400,
  value,
  onChange,
  size = "small",
  fullWidth = true,
  disableCloseOnSelect = true,
  defaultOptions = [],
  maxSelectedOptions,
  permanentOptions = [],
  ...props
}: MultiSelectAsyncProps<TOption>) {
  const [options, setOptions] = useState<TOption[]>(defaultOptions);
  const [inputValue, setInputValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isLoading = isFetching || props.loading;

  const debouncedSearch = useMemo(
    () =>
      debounce(async (inputText: string) => {
        if (typeof getOptions === "function") {
          try {
            // Abort previous request
            if (abortControllerRef.current) abortControllerRef.current.abort();

            // Create new controller
            abortControllerRef.current = new AbortController();
            setIsFetching(true);
            const result = await getOptions(inputText, { signal: abortControllerRef.current.signal });
            setOptions(result);
            setIsFetching(false);
          } catch (error) {
            // Ignore abort errors
            if (error instanceof Error && error.name === "AbortError") return;
            throw error;
          }
        }
      }, debounceMs),
    [debounceMs, getOptions]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const onInputChange = (event: SyntheticEvent<Element, Event> | null, inputText: string) => {
    if (!event || event.type === "click" || typeof getOptions !== "function") {
      return;
    }
    setInputValue(inputText);
    if (inputText) {
      debouncedSearch(inputText);
    }
    if (!inputText) {
      setOptions(defaultOptions);
    }
  };

  const filterPermanentOptions = (newValue: TOption[]) => {
    const permanentItems = (Array.isArray(getOptions) ? getOptions : options).filter((opt) =>
      permanentOptions.includes(getOptionId(opt))
    );
    const nonPermanentSelected = newValue.filter((opt) => !permanentOptions.includes(getOptionId(opt)));
    return [...permanentItems, ...nonPermanentSelected];
  };

  return (
    <Autocomplete
      {...props}
      multiple
      limitTags={10} //display max 10 tags
      size={size}
      fullWidth={fullWidth}
      value={value}
      noOptionsText={noOptionsText}
      inputValue={inputValue}
      onClose={() => {
        setInputValue("");
        setOptions(defaultOptions);
      }}
      options={Array.isArray(getOptions) ? getOptions : options}
      getOptionLabel={getOptionLabel}
      getOptionKey={(option) => getOptionId(option)}
      disableCloseOnSelect={disableCloseOnSelect}
      filterOptions={(options, state) =>
        Array.isArray(getOptions) || typeof getOptions === "object"
          ? createFilterOptions<TOption>()(options, state)
          : options
      }
      isOptionEqualToValue={(option, value) => getOptionId(option) === getOptionId(value)}
      openOnFocus={true}
      groupBy={groupBy ? (option) => groupBy(option) || "" : undefined}
      renderGroup={(params) => {
        const renderGroupLabel = () => {
          if (!getGroupLabel) return params.group;
          const label = getGroupLabel(params.group);
          return label ? label : <div className="tw-my-2 tw-mr-2 tw-border-t tw-border-gray-300" />;
        };

        return (
          <li key={params.key}>
            <div className="tw-p-1 tw-pl-4 tw-text-sm tw-font-medium tw-text-text-secondary">{renderGroupLabel()}</div>
            <ul className="tw-pl-2">{params.children}</ul>
          </li>
        );
      }}
      onChange={(e, value, reason) => {
        // Only take last item selected when single selection is enabled
        const filteredValue = filterPermanentOptions(value);
        if (maxSelectedOptions && filteredValue.length > maxSelectedOptions) {
          filteredValue.splice(0, filteredValue.length - maxSelectedOptions);
        }
        onChange?.(e, filteredValue, reason);
        setInputValue("");
        if (reason === "clear") {
          setOptions(defaultOptions);
        }
      }}
      onInputChange={onInputChange}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          const isPermanent = permanentOptions.includes(getOptionId(option));
          return (
            <Chip
              key={key}
              label={getOptionLabel(option)}
              size="small"
              color="secondary"
              {...tagProps}
              disabled={isPermanent}
              deleteIcon={isPermanent ? <></> : undefined}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? loadingIcon : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option, { selected, inputValue }) => {
        const optionId = getOptionId(option);
        const optionLabel = getOptionLabel(option);
        const matches = match(optionLabel, inputValue, { insideWords: true, findAllOccurrences: true });
        const parts = parse(optionLabel, matches);
        const isPermanent = permanentOptions.includes(optionId);

        const { key, ...optionProps } = props;

        return (
          <li
            key={`${key}-${optionId}-${optionLabel}`}
            {...optionProps}
            className={`${props.className} tw-flex tw-cursor-pointer tw-items-center tw-justify-between tw-gap-2 tw-px-4 tw-py-2 ${isPermanent ? "tw-opacity-50" : ""}`}
          >
            <div>
              <Checkbox
                icon={maxSelectedOptions === 1 ? radioIcon : icon}
                checkedIcon={maxSelectedOptions === 1 ? checkedRadioIcon : checkedIcon}
                style={{ marginRight: 8, padding: 0 }}
                checked={selected}
                disabled={isPermanent}
              />
              {parts.map((part, index) => (
                <span
                  key={index}
                  className={`tw-whitespace-pre-wrap tw-text-sm ${part.highlight ? "tw-bg-secondary/25 tw-font-bold" : ""}`}
                >
                  {part.text}
                </span>
              ))}
            </div>
            {defaultOptions.some((item) => getOptionId(item) === optionId) ? (
              <History className="tw-ml-auto tw-text-gray-400" />
            ) : null}
          </li>
        );
      }}
    />
  );
}
