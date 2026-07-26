import { json } from "../shared/http";

export const RELEASE_639_STATUS_ROUTE = "/api/v1/programme/639/data-deletion-and-cryptographic-erasure/status";

export function release639Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 639,
    capability: "Data Deletion and Cryptographic Erasure",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
