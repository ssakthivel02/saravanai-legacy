import { json } from "../shared/http";

export const RELEASE_638_STATUS_ROUTE = "/api/v1/programme/638/privacy-incident-and-breach-assessment/status";

export function release638Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 638,
    capability: "Privacy Incident and Breach Assessment",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
