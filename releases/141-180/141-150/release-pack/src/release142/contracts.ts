export interface ConversationContext {
  conversationId: string;
  tenantId: string;
  subject: string;
  contextRefs: string[];
  citationRequired: boolean;
  sensitivePersistenceAllowed: false;
}

export const RELEASE_142_CONTROLS = ["context_provenance_required", "sensitive_persistence_forbidden", "limitations_disclosed"] as const;

export function validateConversationContext(value: ConversationContext): string[] {
  const errors: string[] = [];
  if (!value.conversationId.trim()) errors.push("conversationId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subject.trim()) errors.push("subject_required");
  if (!value.contextRefs.length) errors.push("contextRefs_required");
  if (value.sensitivePersistenceAllowed !== false) errors.push("sensitivePersistenceAllowed_must_remain_false");
  return [...new Set(errors)];
}
