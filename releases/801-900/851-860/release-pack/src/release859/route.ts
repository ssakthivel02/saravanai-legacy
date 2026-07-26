import { json } from "../shared/http";

export const RELEASE_859_STATUS_ROUTE = "/api/v1/programme/859/trust-incident-disclosure-and-correction/status";

export function release859Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 859,
    capability: "Trust Incident Disclosure and Correction",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
