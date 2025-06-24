import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { useFocusNavigation } from "./useFocusNavigation";
import { FOCUS_INDICES } from "@/domain/contants/quick-search";
import { Header } from "./Header";
import { AssetList } from "./AssetList";
import { Footer } from "./Footer";
import { openAssetDetailsPage, highlightMatch } from "@/domain/utils/quick-search";
import { blue } from "@mui/material/colors";

interface SearchProps {
  query: string;
  setQuery: (value: string) => void;
  options: QuickSearchResult;
  loading: boolean;
  onInputChange: (value: string) => void;
  open?: boolean;
  setOpen: (visible: boolean) => void;
  openListView?: (value: string) => void;
}

export const QuickSearch: React.FC<SearchProps> = ({
  query,
  setQuery,
  options,
  loading,
  onInputChange,
  open = false,
  setOpen,
  openListView,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(FOCUS_INDICES.INPUT);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { moveFocusForward, moveFocusBackward } = useFocusNavigation(
    inputRef,
    cancelRef,
    closeRef,
    itemRefs,
    viewAllRef,
    options,
    query
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setOpen(true);
    setFocusedIndex(FOCUS_INDICES.INPUT);
    onInputChange(event.target.value);
  };

  const handleClickInput = () => {
    if (!open) setOpen(true);
  };

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      popperRef.current &&
      !popperRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
  };

  const handleOpenListView = (value: string) => {
    if (openListView && value.length > 0) {
      setOpen(false);
      setQuery("");
      openListView(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < options.assets.length) {
        e.stopPropagation();
        openAssetDetailsPage(options.assets[focusedIndex].assetId);
      } else if (focusedIndex === options.assets.length) {
        handleOpenListView(query);
      } else if (focusedIndex === FOCUS_INDICES.CANCEL) {
        handleClear();
      } else if (focusedIndex === FOCUS_INDICES.CLOSE) {
        setOpen(false);
      } else {
        handleOpenListView(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if ((e.key === "ArrowDown" || e.key === "Tab") && open && !e.shiftKey) {
      e.preventDefault();
      setFocusedIndex((prev) => moveFocusForward(prev));
    } else if ((e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) && open) {
      e.preventDefault();
      setFocusedIndex((prev) => moveFocusBackward(prev));
    }
  };

  const handleFocus = () => {
    if (!open) setOpen(true);
    setFocusedIndex(FOCUS_INDICES.INPUT);
  };

  useEffect(() => {
    if (!open || options.assets.length === 0) {
      setFocusedIndex(FOCUS_INDICES.INPUT);
    }
    itemRefs.current = itemRefs.current.slice(0, options.assets.length);
  }, [open, options.assets.length]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
        setFocusedIndex(FOCUS_INDICES.INPUT);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [setOpen]);

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      <Box className="tw-relative tw-z-[999]">
        <TextField
          placeholder="Search Assets"
          className="tw-relative"
          variant="outlined"
          fullWidth
          value={query}
          onChange={handleInputChange}
          onClick={handleClickInput}
          inputRef={inputRef}
          InputProps={{
            startAdornment: <SearchIcon className="tw-mr-2 tw-text-gray-500" />,
            endAdornment: (
              <div className="tw-absolute tw-right-2 tw-top-1">
                {loading ? (
                  <CircularProgress color="inherit" size={20} data-testid="loading-assets" />
                ) : query ? (
                  <IconButton ref={cancelRef} onClick={handleClear} className="!tw-p-0">
                    <CancelIcon className="tw-text-gray-500" />
                  </IconButton>
                ) : null}
              </div>
            ),
          }}
          onFocus={handleFocus}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: blue[50],
              minHeight: "32px",
              height: "32px",
              borderRadius: "4px",
            },
            "& .MuiInputBase-input": {
              fontSize: "16px",
            },
          }}
        />
      </Box>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={open}
          anchorEl={inputRef.current}
          placement="bottom"
          modifiers={[{ name: "offset", options: { offset: [0, -50] } }]}
          className="!tw-z-50 tw-w-full sm:tw-w-auto"
        >
          <Paper
            ref={popperRef}
            className="tw-flex tw-h-[80vh] tw-flex-col !tw-rounded-none !tw-shadow-lg !tw-shadow-gray-500/70 lg:tw-w-[100vh]"
          >
            <Header hasAssets={options.assets.length > 0} query={query} closeRef={closeRef} setOpen={setOpen} />
            <div className="tw-flex-1 tw-overflow-y-auto">
              {options.assets.length > 0 && query.length > 0 ? (
                <AssetList
                  options={options}
                  query={query}
                  itemRefs={itemRefs}
                  openAssetDetailsPage={openAssetDetailsPage}
                  highlightMatch={highlightMatch}
                />
              ) : loading === false ? (
                <div className="tw-mx-[15%] tw-flex tw-h-full tw-flex-col tw-justify-center">
                  <Alert severity="info">
                    <AlertTitle>There are no results</AlertTitle>
                    Search for Assets by typing in part of an <b>Asset ID</b> or a <b>Device Serial Number</b>. If the
                    Asset ID or Device Serial Number contains what you've typed in, it will be returned here.
                  </Alert>
                </div>
              ) : null}
            </div>
            <Footer
              hasAssets={options.assets.length > 0}
              query={query}
              viewAllRef={viewAllRef}
              handleOpenListView={handleOpenListView}
            />
          </Paper>
        </Popper>
      </ClickAwayListener>
    </div>
  );
};
