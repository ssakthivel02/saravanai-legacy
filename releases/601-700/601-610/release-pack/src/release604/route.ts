import { json } from "../shared/http";

export const RELEASE_604_STATUS_ROUTE = "/api/v1/programme/604/inference-request-admission-control/status";

export function release604Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 604,
    capability: "Inference Request Admission Control",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
