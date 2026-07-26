import { json } from "../shared/http";

export const RELEASE_682_STATUS_ROUTE = "/api/v1/programme/682/control-design-and-test-catalogue-v2/status";

export function release682Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 682,
    capability: "Control Design and Test Catalogue v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
