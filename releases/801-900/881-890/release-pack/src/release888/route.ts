import { json } from "../shared/http";

export const RELEASE_888_STATUS_ROUTE = "/api/v1/programme/888/provider-contract-exit-and-portability-readiness/status";

export function release888Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 888,
    capability: "Provider Contract Exit and Portability Readiness",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
