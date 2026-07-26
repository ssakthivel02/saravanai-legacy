import { json } from "../shared/http";

export const RELEASE_645_STATUS_ROUTE = "/api/v1/programme/645/document-presentation-and-pdf-composer/status";

export function release645Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 645,
    capability: "Document Presentation and PDF Composer",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
