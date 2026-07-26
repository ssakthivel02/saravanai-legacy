import { json } from "../shared/http";

export const RELEASE_626_STATUS_ROUTE = "/api/v1/programme/626/citation-evidence-and-source-traceability/status";

export function release626Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 626,
    capability: "Citation Evidence and Source Traceability",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
