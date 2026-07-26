import { json } from "../shared/http";

export const RELEASE_874_STATUS_ROUTE = "/api/v1/programme/874/simulation-execution-sandbox-runtime/status";

export function release874Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 874,
    capability: "Simulation Execution Sandbox Runtime",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
