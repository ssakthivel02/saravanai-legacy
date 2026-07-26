import { json } from "../shared/http";

export const RELEASE_714_STATUS_ROUTE = "/api/v1/programme/714/claim-evidence-and-citation-graph/status";

export function release714Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 714,
    capability: "Claim Evidence and Citation Graph",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
