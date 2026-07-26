export interface ModelRoutePolicy {
  policyId: string;
  tenantId: string;
  capability: string;
  allowedProviders: string[];
  maximumCostPence: number;
  restrictedDataAllowed: boolean;
  enabled: boolean;
}

export const RELEASE_061 = {
  id: "061",
  title: "Responsible Model Routing",
  objective: "Route AI requests through approved free-first models using capability, sensitivity, freshness, safety and budget policy.",
  resource: "model-route-policies"
} as const;
