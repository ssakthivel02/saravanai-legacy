export interface ContinuityExercise {
  exerciseId: string;
  scenario: string;
  serviceIds: string[];
  participantRefs: string[];
  objectiveIds: string[];
  evidenceRefs: string[];
  actionIds: string[];
  outcome: 'planned' | 'passed' | 'partial' | 'failed';
}

export const RELEASE_288_CONTROLS = ["scenario_required", "participants_required", "objectives_required", "failed_requires_actions"] as const;

export function validateContinuityExercise(value: ContinuityExercise): string[] {
  const errors: string[] = [];
  if (!value.exerciseId.trim()) errors.push("exerciseId_required");
  if (!value.scenario.trim()) errors.push("scenario_required");
  if (!value.serviceIds.length) errors.push("serviceIds_required");
  if (!value.participantRefs.length) errors.push("participantRefs_required");
  if (!value.objectiveIds.length) errors.push("objectiveIds_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.actionIds.length) errors.push("actionIds_required");
  return [...new Set(errors)];
}
