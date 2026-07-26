import { json } from "../shared/http";

export const RELEASE_870_STATUS_ROUTE = "/api/v1/programme/870/global-regional-and-accessibility-activation-gate/status";

export function release870Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 870,
    capability: "Global Regional and Accessibility Activation Gate",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
