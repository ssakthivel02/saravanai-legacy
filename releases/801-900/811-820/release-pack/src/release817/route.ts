import { json } from "../shared/http";

export const RELEASE_817_STATUS_ROUTE = "/api/v1/programme/817/ai-request-idempotency-and-replay-protection/status";

export function release817Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 817,
    capability: "AI Request Idempotency and Replay Protection",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
