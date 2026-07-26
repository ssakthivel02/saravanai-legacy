import { json } from "../shared/http";

export const RELEASE_697_STATUS_ROUTE = "/api/v1/programme/697/customer-acceptance-and-pilot-evidence/status";

export function release697Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 697,
    capability: "Customer Acceptance and Pilot Evidence",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
