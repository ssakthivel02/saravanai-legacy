export interface BusinessProcess {
  processId: string;
  tenantId: string;
  version: number;
  stepIds: string[];
  approvalSteps: string[];
  compensationSteps: string[];
  idempotencyRequired: boolean;
  enabled: boolean;
}

export const RELEASE_072 = {
  id: "072",
  title: "Business Process Orchestration",
  objective: "Model tenant-safe business processes as versioned DAGs with approvals, retries, compensation and idempotency.",
  resource: "business-processes"
} as const;
