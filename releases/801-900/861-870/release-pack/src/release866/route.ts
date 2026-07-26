import { json } from "../shared/http";

export const RELEASE_866_STATUS_ROUTE = "/api/v1/programme/866/accessible-component-and-journey-validation/status";

export function release866Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 866,
    capability: "Accessible Component and Journey Validation",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
