import { json } from "../shared/http";

export const RELEASE_837_STATUS_ROUTE = "/api/v1/programme/837/contradiction-and-source-conflict-resolver/status";

export function release837Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 837,
    capability: "Contradiction and Source Conflict Resolver",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
