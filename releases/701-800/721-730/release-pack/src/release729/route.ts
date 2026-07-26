import { json } from "../shared/http";

export const RELEASE_729_STATUS_ROUTE = "/api/v1/programme/729/deployment-preview-and-release-promotion/status";

export function release729Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 729,
    capability: "Deployment Preview and Release Promotion",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
