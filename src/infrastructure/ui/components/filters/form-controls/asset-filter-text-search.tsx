import { FilterFormControl } from "@/components/filters/filter-form-control";
import { Input } from "@/components/input/input";
import SearchIcon from "@mui/icons-material/Search";

type TextSearchProps = {
  label?: string;
  placeholder?: string;
  byTextSearch?: string;
  onChange: (byTextSearch?: string) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function AssetTextSearch({
  label,
  placeholder,
  byTextSearch,
  onChange,
  isPinned,
  onPinChange,
}: TextSearchProps) {
  const commonInputStyles = {
    "& .MuiInputBase-root": {
      backgroundColor: byTextSearch ? "rgba(156, 39, 176, 0.05)" : "inherit",
    },
  };

  return (
    <FilterFormControl label={label ?? ""} pinned={isPinned} onPinClick={onPinChange}>
      <Input
        placeholder={placeholder}
        value={byTextSearch ?? ""}
        onChange={onChange}
        clear={() => onChange(undefined)}
        sx={
          label
            ? commonInputStyles
            : {
                ...commonInputStyles,
                "& .MuiInputBase-root": {
                  ...commonInputStyles["& .MuiInputBase-root"],
                  minHeight: "26px",
                  height: "26px",
                  paddingRight: 0,
                },
                "& .MuiInputBase-input": { padding: "0 8px", fontSize: "16px" },
              }
        }
        className="tw-w-full"
        endIcon={<SearchIcon sx={{ color: "gray", marginRight: 1 }} />}
      />
    </FilterFormControl>
  );
}
