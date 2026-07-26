export interface CapacityProfile {
  profileId: string;
  service: string;
  expectedRps: number;
  maximumRps: number;
  headroomPercent: number;
  latencyP95Ms: number;
  saturationThreshold: number;
  lastTestedAt: string;
}

export const RELEASE_096 = {
  id: "096",
  title: "Capacity and Performance Engineering",
  objective: "Define service capacity, headroom, latency, throughput and saturation thresholds with privacy-safe load tests.",
  resource: "capacity-profiles"
} as const;
