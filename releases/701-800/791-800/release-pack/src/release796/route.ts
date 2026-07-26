import { json } from "../shared/http";

export const RELEASE_796_STATUS_ROUTE = "/api/v1/programme/796/global-rollout-and-regional-readiness-v3/status";

export function release796Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 796,
    capability: "Global Rollout and Regional Readiness v3",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
