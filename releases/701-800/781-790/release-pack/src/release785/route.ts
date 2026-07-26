import { json } from "../shared/http";

export const RELEASE_785_STATUS_ROUTE = "/api/v1/programme/785/executive-decision-brief-and-board-pack/status";

export function release785Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 785,
    capability: "Executive Decision Brief and Board Pack",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
