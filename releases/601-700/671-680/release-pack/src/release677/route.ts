import { json } from "../shared/http";

export const RELEASE_677_STATUS_ROUTE = "/api/v1/programme/677/process-mining-and-improvement-without-surveillance/status";

export function release677Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 677,
    capability: "Process Mining and Improvement without Surveillance",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
