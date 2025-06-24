import { Layout } from "@/views/layout/layout";
import { Button } from "@mui/material";
import { Navigation } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <Layout.Content>
        <div className="tw-flex tw-h-[85vh] tw-justify-center tw-bg-white tw-bg-[url(/aws/assets/images/404.png)] tw-bg-cover tw-bg-fixed">
          <div className="tw-flex tw-items-center tw-gap-20">
            <div className="tw-flex tw-size-64 tw-h-full tw-flex-col tw-items-center tw-justify-center tw-bg-[url(/aws/assets/images/404.svg)] tw-bg-contain tw-bg-center tw-bg-no-repeat">
              <h1 className="tw-text-5xl tw-font-bold tw-uppercase tw-text-white">Internet</h1>
              <h1 className="tw-text-8xl tw-font-bold tw-text-white">404</h1>
            </div>
            <div>
              <div className="tw-text-gray-7 tw-pb-10 tw-text-4xl tw-font-medium tw-text-white">
                The old 404 can be a lonely road.
              </div>
              <div className="tw-pb-10 tw-text-xl tw-text-white">
                Sorry we couldn’t find the route you were looking for, but there are still better roads ahead.
              </div>
              <div>
                <Button
                  onClick={() => navigate("/ng/yard-check")}
                  variant="contained"
                  startIcon={<Navigation className="tw-rotate-90" />}
                >
                  Navigate to home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout.Content>
    </>
  );
}
