export interface SafeguardProfile {
  profileId: string;
  tenantId: string;
  ageBand: "child" | "teen" | "adult" | "unknown";
  vulnerabilityFlags: string[];
  guardianConsentRef: string | undefined;
  personalisationAllowed: boolean;
  directMessagingAllowed: boolean;
  reviewRequired: boolean;
}

export const RELEASE_083 = {
  id: "083",
  title: "Children and Vulnerable User Safety",
  objective: "Apply age assurance, minimisation, guardian controls, safe defaults, escalation and human review for vulnerable users.",
  resource: "safeguard-profiles"
} as const;
