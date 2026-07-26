import { json } from "../shared/http";

export const RELEASE_885_STATUS_ROUTE = "/api/v1/programme/885/finops-allocation-and-showback-without-billing/status";

export function release885Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 885,
    capability: "FinOps Allocation and Showback without Billing",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
