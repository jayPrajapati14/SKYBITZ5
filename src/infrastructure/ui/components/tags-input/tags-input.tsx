import React, { useState } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

interface TagsInputProps {
  label: string;
  placeholder?: string;
  onChange: (tags: string[]) => void;
  tags: string[];
  keysToCreateTag?: string[];
  validator?: (tag: string) => boolean;
}

const TagsInput: React.FC<TagsInputProps> = ({
  label,
  placeholder,
  onChange,
  tags,
  keysToCreateTag = [" ", ",", "Enter"],
  validator,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: string[]) => {
    // Validate the last tag if exists a validator
    if (validator && newValue.length > tags.length) {
      const lastTag = newValue[newValue.length - 1];
      if (!validator(lastTag)) {
        // if validation fails, set the input value to the last tag
        _event.preventDefault();
        setInputValue(lastTag);
        return;
      }
    }
    onChange(newValue);
  };

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const createTagFromInputValue = () => {
    const newTag = inputValue.trim();

    if (validator && !validator(newTag)) return;

    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInputValue("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (keysToCreateTag.includes(event.key) && inputValue.trim() !== "") {
      event.preventDefault();
      createTagFromInputValue();
    }
    event.stopPropagation();
  };

  const onBlur = () => {
    createTagFromInputValue();
  };

  return (
    <Autocomplete
      size="small"
      multiple
      freeSolo
      options={[]}
      filterOptions={() => []}
      value={tags}
      onChange={handleChange}
      open={false}
      forcePopupIcon={false}
      disableCloseOnSelect
      inputValue={inputValue}
      onBlur={onBlur}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="filled" color="primary" size="small" label={option} {...getTagProps({ index })} key={index} />
        ))
      }
      renderInput={(params) => <TextField {...params} variant="outlined" label={label} placeholder={placeholder} />}
    />
  );
};

export default TagsInput;
