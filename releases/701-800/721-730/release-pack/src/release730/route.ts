import { json } from "../shared/http";

export const RELEASE_730_STATUS_ROUTE = "/api/v1/programme/730/application-and-website-factory-assurance-gate/status";

export function release730Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 730,
    capability: "Application and Website Factory Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
