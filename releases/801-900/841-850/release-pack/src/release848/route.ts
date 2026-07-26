import { json } from "../shared/http";

export const RELEASE_848_STATUS_ROUTE = "/api/v1/programme/848/workspace-search-and-knowledge-assistance/status";

export function release848Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 848,
    capability: "Workspace Search and Knowledge Assistance",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
