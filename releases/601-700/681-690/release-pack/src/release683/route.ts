import { json } from "../shared/http";

export const RELEASE_683_STATUS_ROUTE = "/api/v1/programme/683/continuous-control-evidence-collection/status";

export function release683Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 683,
    capability: "Continuous Control Evidence Collection",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
