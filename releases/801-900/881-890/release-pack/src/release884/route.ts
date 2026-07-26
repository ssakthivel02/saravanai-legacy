import { json } from "../shared/http";

export const RELEASE_884_STATUS_ROUTE = "/api/v1/programme/884/cloud-resource-scheduling-and-rightsizing/status";

export function release884Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 884,
    capability: "Cloud Resource Scheduling and Rightsizing",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
