import { json } from "../shared/http";

export const RELEASE_653_STATUS_ROUTE = "/api/v1/programme/653/ephemeral-code-execution-sandbox/status";

export function release653Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 653,
    capability: "Ephemeral Code Execution Sandbox",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
