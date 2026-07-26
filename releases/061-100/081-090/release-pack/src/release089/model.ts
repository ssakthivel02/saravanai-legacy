export interface ThreatIndicator {
  indicatorId: string;
  indicatorType: string;
  valueHash: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  firstSeenAt: string;
  expiresAt: string;
  sharing: "private" | "tenant" | "trusted_community";
}

export const RELEASE_089 = {
  id: "089",
  title: "Security Operations and Threat Intelligence",
  objective: "Manage indicators, detections, incidents, confidence, expiry, sharing restrictions and response actions.",
  resource: "threat-indicators"
} as const;
