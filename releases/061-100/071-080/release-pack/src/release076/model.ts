export interface LearningPath {
  pathId: string;
  tenantId: string;
  title: string;
  competencyIds: string[];
  moduleIds: string[];
  assessmentIds: string[];
  accessibilityReviewed: boolean;
  certificationClaim: false;
}

export const RELEASE_076 = {
  id: "076",
  title: "Learning and Skills Platform",
  objective: "Deliver accessible learning paths, competency evidence, assessments and role-based development plans without unverified certification claims.",
  resource: "learning-paths"
} as const;
