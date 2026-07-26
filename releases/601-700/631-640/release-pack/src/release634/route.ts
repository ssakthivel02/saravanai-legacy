import { json } from "../shared/http";

export const RELEASE_634_STATUS_ROUTE = "/api/v1/programme/634/regional-routing-and-processing-control/status";

export function release634Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 634,
    capability: "Regional Routing and Processing Control",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
