import { json } from "../shared/http";

export const RELEASE_763_STATUS_ROUTE = "/api/v1/programme/763/infrastructure-as-code-module-registry/status";

export function release763Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 763,
    capability: "Infrastructure as Code Module Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
