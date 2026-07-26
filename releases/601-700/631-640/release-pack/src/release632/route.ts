import { json } from "../shared/http";

export const RELEASE_632_STATUS_ROUTE = "/api/v1/programme/632/purpose-and-processing-activity-catalogue/status";

export function release632Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 632,
    capability: "Purpose and Processing Activity Catalogue",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
