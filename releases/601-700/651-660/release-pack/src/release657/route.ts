import { json } from "../shared/http";

export const RELEASE_657_STATUS_ROUTE = "/api/v1/programme/657/infrastructure-and-policy-code-governance/status";

export function release657Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 657,
    capability: "Infrastructure and Policy Code Governance",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
