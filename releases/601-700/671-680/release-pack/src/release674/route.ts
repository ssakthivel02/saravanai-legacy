import { json } from "../shared/http";

export const RELEASE_674_STATUS_ROUTE = "/api/v1/programme/674/rules-and-decision-table-governance/status";

export function release674Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 674,
    capability: "Rules and Decision Table Governance",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
