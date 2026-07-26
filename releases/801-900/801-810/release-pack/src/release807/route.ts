import { json } from "../shared/http";

export const RELEASE_807_STATUS_ROUTE = "/api/v1/programme/807/session-revocation-and-device-trust/status";

export function release807Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 807,
    capability: "Session Revocation and Device Trust",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
