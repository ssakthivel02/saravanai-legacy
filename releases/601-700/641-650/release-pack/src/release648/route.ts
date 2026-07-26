import { json } from "../shared/http";

export const RELEASE_648_STATUS_ROUTE = "/api/v1/programme/648/media-provenance-packaging-and-verification/status";

export function release648Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 648,
    capability: "Media Provenance Packaging and Verification",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
