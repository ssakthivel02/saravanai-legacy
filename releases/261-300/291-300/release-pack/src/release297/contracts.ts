export interface GlobalSupportModel {
  modelId: string;
  owner: string;
  regions: string[];
  handoverProcedureId: string;
  severityCoverage: string[];
  knowledgeBaseIds: string[];
  escalationRoles: string[];
  status: 'draft' | 'active' | 'retired';
}

export const RELEASE_297_CONTROLS = ["owner_required", "regions_required", "handover_required", "escalation_required"] as const;

export function validateGlobalSupportModel(value: GlobalSupportModel): string[] {
  const errors: string[] = [];
  if (!value.modelId.trim()) errors.push("modelId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.regions.length) errors.push("regions_required");
  if (!value.handoverProcedureId.trim()) errors.push("handoverProcedureId_required");
  if (!value.severityCoverage.length) errors.push("severityCoverage_required");
  if (!value.knowledgeBaseIds.length) errors.push("knowledgeBaseIds_required");
  if (!value.escalationRoles.length) errors.push("escalationRoles_required");
  return [...new Set(errors)];
}
