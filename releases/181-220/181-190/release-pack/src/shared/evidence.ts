export interface EvidenceReference {
  evidenceId: string;
  type: string;
  uri: string;
  sha256: string;
  createdAt: string;
  createdBy: string;
}

export function validSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}
