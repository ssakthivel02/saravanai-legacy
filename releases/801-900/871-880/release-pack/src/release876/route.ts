import { json } from "../shared/http";

export const RELEASE_876_STATUS_ROUTE = "/api/v1/programme/876/operational-forecast-and-capacity-simulation/status";

export function release876Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 876,
    capability: "Operational Forecast and Capacity Simulation",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
