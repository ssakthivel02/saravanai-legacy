import { json } from "../shared/http";

export const RELEASE_867_STATUS_ROUTE = "/api/v1/programme/867/regional-consent-and-notice-orchestration/status";

export function release867Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 867,
    capability: "Regional Consent and Notice Orchestration",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
