import { json } from "../shared/http";

export const RELEASE_827_STATUS_ROUTE = "/api/v1/programme/827/compensating-action-and-rollback-executor/status";

export function release827Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 827,
    capability: "Compensating Action and Rollback Executor",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
