import { json } from "../shared/http";

export const RELEASE_875_STATUS_ROUTE = "/api/v1/programme/875/scenario-comparison-and-sensitivity-analysis/status";

export function release875Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 875,
    capability: "Scenario Comparison and Sensitivity Analysis",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
