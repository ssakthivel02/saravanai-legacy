import { json } from "../shared/http";

export const RELEASE_622_STATUS_ROUTE = "/api/v1/programme/622/ingestion-parsing-and-normalisation-pipeline/status";

export function release622Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 622,
    capability: "Ingestion Parsing and Normalisation Pipeline",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
