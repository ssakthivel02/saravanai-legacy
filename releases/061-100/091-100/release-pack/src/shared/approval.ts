export interface ApprovalEvidence {
  approvalId: string;
  requestedBy: string;
  decidedBy: string;
  decision: "approved" | "rejected";
  expiresAt: string;
  evidenceIds: string[];
}

export function validFourEyesApproval(value: ApprovalEvidence, now = Date.now()): boolean {
  return value.decision === "approved" &&
    value.requestedBy !== value.decidedBy &&
    value.evidenceIds.length > 0 &&
    new Date(value.expiresAt).getTime() > now;
}
