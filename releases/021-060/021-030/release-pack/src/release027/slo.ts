export const SLOS = {
  apiAvailability: { target: 0.995, windowDays: 30 },
  apiLatencyP95Ms: { target: 1500, windowDays: 30 },
  criticalAuditDelivery: { target: 0.999, windowDays: 30 },
  backupRestoreSuccess: { target: 1.0, windowDays: 90 }
} as const;

export function errorBudget(target: number): number {
  return 1 - target;
}
