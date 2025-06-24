import { useEffect } from "react";

/**
 * @description
 * This hook is used to add global styles to the document head.
 * It is used to add styles dynamically (for example, to the date range picker).
 * @param key - The key of the style element to identify in the document head.
 * @param styles - The styles to add to the style element.
 */
export function useGlobalStyles(key: string, styles: string) {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-source", key);
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      const existingStyle = document.querySelector(`style[data-source="${key}"]`);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [key, styles]);
}
