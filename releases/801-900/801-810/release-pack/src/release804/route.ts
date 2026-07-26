import { json } from "../shared/http";

export const RELEASE_804_STATUS_ROUTE = "/api/v1/programme/804/rbac-and-abac-decision-engine-v2/status";

export function release804Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 804,
    capability: "RBAC and ABAC Decision Engine v2",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
