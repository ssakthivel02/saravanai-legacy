import { json } from "../shared/http";

export const RELEASE_721_STATUS_ROUTE = "/api/v1/programme/721/application-product-brief-and-requirements/status";

export function release721Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 721,
    capability: "Application Product Brief and Requirements",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
