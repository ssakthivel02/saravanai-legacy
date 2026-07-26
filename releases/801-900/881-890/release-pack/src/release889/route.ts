import { json } from "../shared/http";

export const RELEASE_889_STATUS_ROUTE = "/api/v1/programme/889/economic-stress-test-and-hard-stop-exercise/status";

export function release889Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 889,
    capability: "Economic Stress Test and Hard Stop Exercise",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
