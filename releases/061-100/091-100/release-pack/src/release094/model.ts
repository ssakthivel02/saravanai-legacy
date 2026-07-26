export interface ProgressiveRollout {
  rolloutId: string;
  releaseId: string;
  waves: string[];
  currentWave: string;
  successCriteria: string[];
  abortCriteria: string[];
  rollbackRef: string;
  status: "planned" | "running" | "paused" | "completed" | "rolled_back";
}

export const RELEASE_094 = {
  id: "094",
  title: "Progressive Delivery and Release Engineering",
  objective: "Use feature flags, deployment waves, canaries, automated rollback and evidence-backed promotion decisions.",
  resource: "progressive-rollouts"
} as const;
