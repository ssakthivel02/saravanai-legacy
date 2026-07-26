import { json } from "../shared/http";

export const RELEASE_856_STATUS_ROUTE = "/api/v1/programme/856/supplier-assurance-and-dependency-register/status";

export function release856Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 856,
    capability: "Supplier Assurance and Dependency Register",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
