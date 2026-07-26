import { json } from "../shared/http";

export const RELEASE_664_STATUS_ROUTE = "/api/v1/programme/664/anomaly-detection-and-alert-quality/status";

export function release664Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 664,
    capability: "Anomaly Detection and Alert Quality",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
