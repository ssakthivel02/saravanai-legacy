import { json } from "../shared/http";

export const RELEASE_832_STATUS_ROUTE = "/api/v1/programme/832/document-ingestion-and-quarantine-worker/status";

export function release832Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 832,
    capability: "Document Ingestion and Quarantine Worker",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
