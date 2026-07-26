import { json } from "../shared/http";

export const RELEASE_655_STATUS_ROUTE = "/api/v1/programme/655/build-reproducibility-and-provenance-v2/status";

export function release655Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 655,
    capability: "Build Reproducibility and Provenance v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
