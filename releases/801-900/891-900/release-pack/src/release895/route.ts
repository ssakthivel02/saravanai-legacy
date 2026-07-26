import { json } from "../shared/http";

export const RELEASE_895_STATUS_ROUTE = "/api/v1/programme/895/end-to-end-critical-journey-test-programme/status";

export function release895Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 895,
    capability: "End-to-End Critical Journey Test Programme",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
