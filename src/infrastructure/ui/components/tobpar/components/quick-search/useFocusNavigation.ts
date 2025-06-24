import { FOCUS_INDICES } from "@/domain/contants/quick-search";

export const useFocusNavigation = (
  inputRef: React.RefObject<HTMLInputElement>,
  cancelRef: React.RefObject<HTMLButtonElement>,
  closeRef: React.RefObject<HTMLButtonElement>,
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  viewAllRef: React.RefObject<HTMLButtonElement>,
  options: QuickSearchResult,
  query: string
) => {
  const moveFocusForward = (currentIndex: number): number => {
    if (currentIndex === FOCUS_INDICES.INPUT && query && cancelRef.current) {
      cancelRef.current.focus();
      return FOCUS_INDICES.CANCEL;
    } else if (currentIndex === FOCUS_INDICES.CANCEL || (currentIndex === FOCUS_INDICES.INPUT && !query)) {
      closeRef.current?.focus();
      return FOCUS_INDICES.CLOSE;
    } else if (currentIndex === FOCUS_INDICES.CLOSE && options.assets.length > 0) {
      itemRefs.current[0]?.focus();
      return 0;
    } else if (currentIndex >= 0 && currentIndex < options.assets.length - 1) {
      itemRefs.current[currentIndex + 1]?.focus();
      return currentIndex + 1;
    } else if (currentIndex === options.assets.length - 1 && options.assets.length > 0) {
      viewAllRef.current?.focus();
      return options.assets.length;
    }
    return currentIndex;
  };

  const moveFocusBackward = (currentIndex: number): number => {
    if (currentIndex === options.assets.length) {
      itemRefs.current[options.assets.length - 1]?.focus();
      return options.assets.length - 1;
    } else if (currentIndex > 0) {
      itemRefs.current[currentIndex - 1]?.focus();
      return currentIndex - 1;
    } else if (currentIndex === 0) {
      closeRef.current?.focus();
      return FOCUS_INDICES.CLOSE;
    } else if (currentIndex === FOCUS_INDICES.CLOSE) {
      (query ? cancelRef.current : inputRef.current)?.focus();
      return query ? FOCUS_INDICES.CANCEL : FOCUS_INDICES.INPUT;
    } else if (currentIndex === FOCUS_INDICES.CANCEL && inputRef.current) {
      inputRef.current.focus();
      return FOCUS_INDICES.INPUT;
    }
    return currentIndex;
  };

  return { moveFocusForward, moveFocusBackward };
};
