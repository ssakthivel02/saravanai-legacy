import { json } from "../shared/http";

export const RELEASE_794_STATUS_ROUTE = "/api/v1/programme/794/production-data-and-migration-readiness-v5/status";

export function release794Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 794,
    capability: "Production Data and Migration Readiness v5",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
