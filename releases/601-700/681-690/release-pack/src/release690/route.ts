import { json } from "../shared/http";

export const RELEASE_690_STATUS_ROUTE = "/api/v1/programme/690/compliance-and-assurance-gate/status";

export function release690Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 690,
    capability: "Compliance and Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
