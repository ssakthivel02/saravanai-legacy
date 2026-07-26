import { json } from "../shared/http";

export const RELEASE_872_STATUS_ROUTE = "/api/v1/programme/872/simulation-scenario-and-assumption-contract/status";

export function release872Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 872,
    capability: "Simulation Scenario and Assumption Contract",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
