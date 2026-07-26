import { json } from "../shared/http";

export const RELEASE_873_STATUS_ROUTE = "/api/v1/programme/873/synthetic-data-and-privacy-boundary/status";

export function release873Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 873,
    capability: "Synthetic Data and Privacy Boundary",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
