import { json } from "../shared/http";

export const RELEASE_603_STATUS_ROUTE = "/api/v1/programme/603/dynamic-model-routing-control/status";

export function release603Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 603,
    capability: "Dynamic Model Routing Control",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
