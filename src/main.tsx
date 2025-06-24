import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/styles/theme";
import { startWorker } from "@/infrastructure/mock/browser";
import { QueryClientProvider } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import { queryClient } from "@/infrastructure/query-client";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { setupExtendSessionInterval } from "@/components/extend-session";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { routes } from "@/routes";
import "@/styles/main.css";

async function enableMocking() {
  if (import.meta.env.VITE_MOCK_API === "true") {
    await startWorker();
  }
}

enableMocking().then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={createBrowserRouter(routes)} />
          </QueryClientProvider>
        </NotificationProvider>
      </ThemeProvider>
    </StrictMode>
  )
);

setupExtendSessionInterval();
