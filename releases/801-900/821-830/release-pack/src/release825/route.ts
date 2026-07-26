import { json } from "../shared/http";

export const RELEASE_825_STATUS_ROUTE = "/api/v1/programme/825/checkpoint-and-durable-agent-state/status";

export function release825Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 825,
    capability: "Checkpoint and Durable Agent State",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
