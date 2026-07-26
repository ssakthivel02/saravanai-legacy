export interface ContinuityExitPlan {
  planId: string;
  service: string;
  dataExportFormat: string;
  providerExitSteps: string[];
  credentialRevocationSteps: string[];
  archivePolicyRef: string;
  customerCommunicationPlan: string;
  lastRehearsedAt: string;
}

export const RELEASE_098 = {
  id: "098",
  title: "Enterprise Continuity and Exit Strategy",
  objective: "Maintain data portability, provider exit, credential revocation, archive, retention, customer transition and service closure plans.",
  resource: "continuity-exit-plans"
} as const;
