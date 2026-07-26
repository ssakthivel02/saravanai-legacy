import { json } from "../shared/http";

export const RELEASE_877_STATUS_ROUTE = "/api/v1/programme/877/resilience-failure-and-recovery-simulation/status";

export function release877Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 877,
    capability: "Resilience Failure and Recovery Simulation",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
