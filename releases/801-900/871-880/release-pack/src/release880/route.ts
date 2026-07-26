import { json } from "../shared/http";

export const RELEASE_880_STATUS_ROUTE = "/api/v1/programme/880/digital-twin-and-simulation-activation-gate/status";

export function release880Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 880,
    capability: "Digital Twin and Simulation Activation Gate",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
