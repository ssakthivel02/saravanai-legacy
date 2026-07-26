import { json } from "../shared/http";

export const RELEASE_740_STATUS_ROUTE = "/api/v1/programme/740/communications-and-customer-operations-gate/status";

export function release740Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 740,
    capability: "Communications and Customer Operations Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
