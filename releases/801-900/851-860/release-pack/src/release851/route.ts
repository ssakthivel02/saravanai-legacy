import { json } from "../shared/http";

export const RELEASE_851_STATUS_ROUTE = "/api/v1/programme/851/trust-centre-control-and-evidence-catalogue/status";

export function release851Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 851,
    capability: "Trust Centre Control and Evidence Catalogue",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
