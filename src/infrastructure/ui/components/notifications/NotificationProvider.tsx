import React from "react";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "./useShowNotification";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <SnackbarUtilsConfigurator />
      {children}
    </SnackbarProvider>
  );
}
