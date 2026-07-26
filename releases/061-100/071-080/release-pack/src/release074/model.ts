export interface SecureMessage {
  messageId: string;
  tenantId: string;
  channel: "in_app" | "email";
  recipientRef: string;
  classification: "internal" | "confidential" | "restricted";
  templateId: string;
  approvalId: string | undefined;
  status: "draft" | "queued" | "sent" | "failed";
}

export const RELEASE_074 = {
  id: "074",
  title: "Secure Communications Hub",
  objective: "Provide classified, tenant-scoped outbound and in-app communications with recipient verification, quiet hours and delivery evidence.",
  resource: "secure-messages"
} as const;
