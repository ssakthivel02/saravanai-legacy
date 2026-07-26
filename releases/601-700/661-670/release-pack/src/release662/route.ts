import { json } from "../shared/http";

export const RELEASE_662_STATUS_ROUTE = "/api/v1/programme/662/service-dependency-and-criticality-map-v2/status";

export function release662Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 662,
    capability: "Service Dependency and Criticality Map v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
