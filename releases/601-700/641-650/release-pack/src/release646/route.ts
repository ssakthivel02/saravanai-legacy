import { json } from "../shared/http";

export const RELEASE_646_STATUS_ROUTE = "/api/v1/programme/646/media-quality-and-brand-compliance/status";

export function release646Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 646,
    capability: "Media Quality and Brand Compliance",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
