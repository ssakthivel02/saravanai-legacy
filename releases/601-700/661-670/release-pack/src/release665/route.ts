import { json } from "../shared/http";

export const RELEASE_665_STATUS_ROUTE = "/api/v1/programme/665/incident-intelligence-and-triage-assistant/status";

export function release665Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 665,
    capability: "Incident Intelligence and Triage Assistant",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
