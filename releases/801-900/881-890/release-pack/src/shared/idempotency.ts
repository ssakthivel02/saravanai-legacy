export interface IdempotencyRecord {
  tenantId: string;
  key: string;
  payloadSha256: string;
  expiresAt: string;
  resultRef?: string;
}

export function replayAllowed(existing: IdempotencyRecord | undefined, payloadSha256: string): boolean {
  return !existing || existing.payloadSha256 === payloadSha256;
}
