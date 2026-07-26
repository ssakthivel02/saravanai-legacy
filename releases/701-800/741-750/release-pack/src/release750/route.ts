import { json } from "../shared/http";

export const RELEASE_750_STATUS_ROUTE = "/api/v1/programme/750/learning-and-career-services-assurance-gate/status";

export function release750Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 750,
    capability: "Learning and Career Services Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
