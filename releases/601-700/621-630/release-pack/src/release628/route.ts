import { json } from "../shared/http";

export const RELEASE_628_STATUS_ROUTE = "/api/v1/programme/628/knowledge-conflict-and-canonical-resolution/status";

export function release628Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 628,
    capability: "Knowledge Conflict and Canonical Resolution",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
