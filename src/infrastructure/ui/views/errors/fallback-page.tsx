import { useRouteError } from "react-router-dom";
import { useEffect } from "react";
import { getCookie } from "../../../api-fetch/api-fetch";
import { ErrorData, sendNotification } from "../../../errors/logger";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Navigation, WarningAmberOutlined } from "@mui/icons-material";

export function FallbackPage() {
  const navigate = useNavigate();
  const error: ErrorData = useRouteError() as ErrorData;
  useEffect(() => {
    if (error) {
      const customerId = getCookie("udke");
      const errorData: ErrorData = {
        message: error.message || "Unknown error",
        stack: error.stack || "No stack trace available",
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        customerId: (customerId ?? 0) as number,
      };
      sendNotification(errorData);
    }
  }, [error]);

  return (
    <div className="tw-flex tw-h-screen tw-items-center tw-justify-center tw-gap-5">
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-5 tw-rounded-md tw-bg-white tw-p-5 tw-py-16 tw-shadow-2xl tw-shadow-gray-700/50">
        <div>
          <WarningAmberOutlined className="!tw-size-20 tw-text-red-700" />
        </div>
        <h1 className="tw-text-2xl">Oops! We’ve hit a roadblock.</h1>
        <h1>We’re sorry, but we’ve encountered an unexpected error.</h1>
        <Button
          onClick={() => navigate("/ng/yard-check")}
          variant="contained"
          startIcon={<Navigation className="tw-rotate-90" />}
          className="tw-w-fit"
        >
          Navigate to home
        </Button>
      </div>
    </div>
  );
}
