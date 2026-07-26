import { json } from "../shared/http";

export const RELEASE_654_STATUS_ROUTE = "/api/v1/programme/654/dependency-and-package-admission/status";

export function release654Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 654,
    capability: "Dependency and Package Admission",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
