import { json } from "../shared/http";

export const RELEASE_755_STATUS_ROUTE = "/api/v1/programme/755/sensor-data-quality-and-minimisation/status";

export function release755Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 755,
    capability: "Sensor Data Quality and Minimisation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
