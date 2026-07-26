export function validFourEyes(
  requester: string,
  approver: string,
  evidenceRefs: string[]
): boolean {
  return requester !== approver && Boolean(approver) && evidenceRefs.length > 0;
}
