import { json } from "../shared/http";

export const RELEASE_764_STATUS_ROUTE = "/api/v1/programme/764/server-and-workload-modernisation-assessment/status";

export function release764Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 764,
    capability: "Server and Workload Modernisation Assessment",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
