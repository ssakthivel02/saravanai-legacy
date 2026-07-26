export interface CommunicationAction {
  actionId: string;
  tenantId: string;
  channel: 'email' | 'calendar' | 'collaboration';
  recipientRefs: string[];
  templateId: string;
  approvalId: string | undefined;
  externalSend: boolean;
  status: 'draft' | 'approved' | 'sent' | 'cancelled';
}

export const RELEASE_266_CONTROLS = ["recipient_validation_required", "template_required", "external_send_requires_approval", "audit_receipt_required"] as const;

export function validateCommunicationAction(value: CommunicationAction): string[] {
  const errors: string[] = [];
  if (!value.actionId.trim()) errors.push("actionId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.recipientRefs.length) errors.push("recipientRefs_required");
  if (!value.templateId.trim()) errors.push("templateId_required");
  return [...new Set(errors)];
}
