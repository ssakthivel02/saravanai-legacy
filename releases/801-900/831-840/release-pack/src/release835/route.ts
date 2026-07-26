import { json } from "../shared/http";

export const RELEASE_835_STATUS_ROUTE = "/api/v1/programme/835/citation-anchor-and-evidence-resolver/status";

export function release835Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 835,
    capability: "Citation Anchor and Evidence Resolver",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
