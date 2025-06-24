import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export async function startWorker() {
  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: "bypass" });
}
