import { json } from "../shared/http";

export const RELEASE_756_STATUS_ROUTE = "/api/v1/programme/756/ot-vulnerability-and-patch-readiness/status";

export function release756Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 756,
    capability: "OT Vulnerability and Patch Readiness",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
