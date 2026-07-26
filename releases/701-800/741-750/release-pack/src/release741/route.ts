import { json } from "../shared/http";

export const RELEASE_741_STATUS_ROUTE = "/api/v1/programme/741/learning-programme-and-curriculum-registry/status";

export function release741Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 741,
    capability: "Learning Programme and Curriculum Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
