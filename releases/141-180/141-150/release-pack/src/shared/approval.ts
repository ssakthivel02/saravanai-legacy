export interface ApprovalRecord {
  approvalId: string;
  requestedBy: string;
  decidedBy: string;
  decision: "approved" | "rejected";
  evidenceRefs: string[];
  expiresAt: string;
}
export function validFourEyes(value: ApprovalRecord, now = Date.now()): boolean {
  return value.decision === "approved" &&
    value.requestedBy !== value.decidedBy &&
    value.evidenceRefs.length > 0 &&
    new Date(value.expiresAt).getTime() > now;
}
