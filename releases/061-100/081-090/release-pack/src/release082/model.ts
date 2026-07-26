export interface RegionalDataPolicy {
  policyId: string;
  region: string;
  allowedStorageRegions: string[];
  allowedProcessingRegions: string[];
  transferMechanism: string | undefined;
  legalReviewRequired: boolean;
  status: "draft" | "approved" | "suspended";
}

export const RELEASE_082 = {
  id: "082",
  title: "Regional Data Controls",
  objective: "Enforce regional storage, processing and transfer policies with explicit exceptions and legal review requirements.",
  resource: "regional-data-policies"
} as const;
