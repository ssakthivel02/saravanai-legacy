import { json } from "../shared/http";

export const RELEASE_670_STATUS_ROUTE = "/api/v1/programme/670/observability-and-sre-assurance-gate/status";

export function release670Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 670,
    capability: "Observability and SRE Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
