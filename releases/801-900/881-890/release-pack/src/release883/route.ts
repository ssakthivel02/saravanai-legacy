import { json } from "../shared/http";

export const RELEASE_883_STATUS_ROUTE = "/api/v1/programme/883/capacity-forecast-and-admission-planning/status";

export function release883Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 883,
    capability: "Capacity Forecast and Admission Planning",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
