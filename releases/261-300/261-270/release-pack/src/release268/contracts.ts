export interface ProcessMiningStudy {
  studyId: string;
  tenantId: string;
  processId: string;
  eventSourceRefs: string[];
  conformanceScore: number;
  deviationIds: string[];
  owner: string;
  invasiveWorkerMonitoringAllowed: false;
}

export const RELEASE_268_CONTROLS = ["event_provenance_required", "score_bounded", "owner_required", "invasive_monitoring_forbidden"] as const;

export function validateProcessMiningStudy(value: ProcessMiningStudy): string[] {
  const errors: string[] = [];
  if (!value.studyId.trim()) errors.push("studyId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.processId.trim()) errors.push("processId_required");
  if (!value.eventSourceRefs.length) errors.push("eventSourceRefs_required");
  if (!Number.isFinite(value.conformanceScore) || value.conformanceScore < 0) errors.push("conformanceScore_invalid");
  if (!value.deviationIds.length) errors.push("deviationIds_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (value.invasiveWorkerMonitoringAllowed !== false) errors.push("invasiveWorkerMonitoringAllowed_must_remain_false");
  if (value.conformanceScore < 0 || value.conformanceScore > 1) errors.push("conformanceScore_out_of_range");
  return [...new Set(errors)];
}
