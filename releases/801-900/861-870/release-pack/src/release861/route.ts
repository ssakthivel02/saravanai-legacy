import { json } from "../shared/http";

export const RELEASE_861_STATUS_ROUTE = "/api/v1/programme/861/jurisdiction-and-regional-policy-registry/status";

export function release861Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 861,
    capability: "Jurisdiction and Regional Policy Registry",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
