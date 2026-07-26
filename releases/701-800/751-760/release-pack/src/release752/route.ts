import { json } from "../shared/http";

export const RELEASE_752_STATUS_ROUTE = "/api/v1/programme/752/ot-network-zone-and-conduit-model/status";

export function release752Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 752,
    capability: "OT Network Zone and Conduit Model",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
