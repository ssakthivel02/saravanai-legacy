import { json } from "../shared/http";

export const RELEASE_693_STATUS_ROUTE = "/api/v1/programme/693/tenant-onboarding-and-configuration-factory-v2/status";

export function release693Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 693,
    capability: "Tenant Onboarding and Configuration Factory v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
