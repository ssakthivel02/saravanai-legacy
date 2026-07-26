import { json } from "../shared/http";

export const RELEASE_681_STATUS_ROUTE = "/api/v1/programme/681/obligation-and-control-requirement-registry/status";

export function release681Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 681,
    capability: "Obligation and Control Requirement Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
