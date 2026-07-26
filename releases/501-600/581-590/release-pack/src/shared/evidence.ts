export interface EvidenceReference {
  evidenceId: string;
  evidenceType: string;
  uri: string;
  sha256: string;
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
}

export function validSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}
