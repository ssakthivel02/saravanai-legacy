import { json } from "../shared/http";

export const RELEASE_685_STATUS_ROUTE = "/api/v1/programme/685/issue-finding-and-remediation-management/status";

export function release685Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 685,
    capability: "Issue Finding and Remediation Management",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
