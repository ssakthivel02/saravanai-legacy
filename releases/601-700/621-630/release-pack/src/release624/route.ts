import { json } from "../shared/http";

export const RELEASE_624_STATUS_ROUTE = "/api/v1/programme/624/retrieval-access-filter-enforcement/status";

export function release624Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 624,
    capability: "Retrieval Access Filter Enforcement",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
