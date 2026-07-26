import { json } from "../shared/http";

export const RELEASE_797_STATUS_ROUTE = "/api/v1/programme/797/customer-pilot-and-adoption-evidence-v2/status";

export function release797Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 797,
    capability: "Customer Pilot and Adoption Evidence v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
