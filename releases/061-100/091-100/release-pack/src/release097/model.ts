export interface CarbonAwarePolicy {
  policyId: string;
  service: string;
  region: string;
  deferrable: boolean;
  maximumDelayMinutes: number;
  safetyOverride: boolean;
  measurementMethod: string;
  enabled: boolean;
}

export const RELEASE_097 = {
  id: "097",
  title: "Sustainability and Carbon-Aware Computing",
  objective: "Measure estimated workload impact, prefer efficient free-first routes and schedule deferrable work without reducing safety.",
  resource: "carbon-aware-policies"
} as const;
