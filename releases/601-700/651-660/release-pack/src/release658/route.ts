import { json } from "../shared/http";

export const RELEASE_658_STATUS_ROUTE = "/api/v1/programme/658/secure-release-artefact-registry/status";

export function release658Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 658,
    capability: "Secure Release Artefact Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
