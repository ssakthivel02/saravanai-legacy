import { json } from "../shared/http";

export const RELEASE_857_STATUS_ROUTE = "/api/v1/programme/857/compliance-obligation-change-monitor/status";

export function release857Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 857,
    capability: "Compliance Obligation Change Monitor",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
