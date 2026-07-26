import type { SecureMessage } from "./model";

export const RELEASE_074_CONTROL_RULES = ["verified_recipient_required", "restricted_email_denied", "template_required", "approval_required_for_bulk_message", "delivery_receipt_required"] as const;

export function validateSecureMessage(input: SecureMessage): string[] {
  const errors: string[] = [];
  if (!String(input.messageId ?? "").trim()) errors.push("messageId_required");
  return [...new Set(errors)];
}

export function release074Ready(input: SecureMessage): boolean {
  return validateSecureMessage(input).length === 0;
}
