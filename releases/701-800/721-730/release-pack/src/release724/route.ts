import { json } from "../shared/http";

export const RELEASE_724_STATUS_ROUTE = "/api/v1/programme/724/mobile-and-progressive-web-experience/status";

export function release724Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 724,
    capability: "Mobile and Progressive Web Experience",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
