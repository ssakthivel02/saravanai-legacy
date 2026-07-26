import { json } from "../shared/http";

export const RELEASE_713_STATUS_ROUTE = "/api/v1/programme/713/primary-source-acquisition-and-preservation/status";

export function release713Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 713,
    capability: "Primary Source Acquisition and Preservation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
