import { json } from "../shared/http";

export const RELEASE_749_STATUS_ROUTE = "/api/v1/programme/749/training-accessibility-and-multilingual-delivery/status";

export function release749Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 749,
    capability: "Training Accessibility and Multilingual Delivery",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
