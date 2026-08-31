export interface SessionPolicy {
  absoluteTtlSeconds: number;
  idleTtlSeconds: number;
  requireMfaForPrivileged: boolean;
  rotateAfterPrivilegeChange: boolean;
}

export const DEFAULT_SESSION_POLICY: SessionPolicy = {
  absoluteTtlSeconds: 8 * 60 * 60,
  idleTtlSeconds: 30 * 60,
  requireMfaForPrivileged: true,
  rotateAfterPrivilegeChange: true
};

export function validateSessionTimes(createdAt: number, lastSeenAt: number, now: number, policy = DEFAULT_SESSION_POLICY) {
  if (now - createdAt > policy.absoluteTtlSeconds * 1000) return "absolute_expired";
  if (now - lastSeenAt > policy.idleTtlSeconds * 1000) return "idle_expired";
  return "valid";
}
