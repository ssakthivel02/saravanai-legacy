import { json } from "../shared/http";

export const RELEASE_687_STATUS_ROUTE = "/api/v1/programme/687/audit-request-and-evidence-workspace/status";

export function release687Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 687,
    capability: "Audit Request and Evidence Workspace",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
