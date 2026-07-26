import { json } from "../shared/http";

export const RELEASE_758_STATUS_ROUTE = "/api/v1/programme/758/ot-security-monitoring-and-incident-response/status";

export function release758Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 758,
    capability: "OT Security Monitoring and Incident Response",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
