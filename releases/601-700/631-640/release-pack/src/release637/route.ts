import { json } from "../shared/http";

export const RELEASE_637_STATUS_ROUTE = "/api/v1/programme/637/sensitive-data-discovery-and-classification/status";

export function release637Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 637,
    capability: "Sensitive Data Discovery and Classification",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
