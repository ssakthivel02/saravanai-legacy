import { json } from "../shared/http";

export const RELEASE_659_STATUS_ROUTE = "/api/v1/programme/659/developer-platform-incident-and-recovery/status";

export function release659Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 659,
    capability: "Developer Platform Incident and Recovery",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
