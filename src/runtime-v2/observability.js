import { wave2State } from './boundary.js';
import { WAVE2_TOOL_REGISTRY } from './tool-registry.js';

export function wave2Observability(env = {}) {
  return {
    release: 'runtime-wave-2.0.0',
    state: wave2State(env),
    controls: {
      planOnly: true,
      toolLeaseProposalOnly: true,
      approvalClassificationOnly: true,
      rollbackPlanOnly: true,
      idempotencyInspectionOnly: true,
      externalExecution: false,
      databaseWrites: false,
      sensitiveContentLogging: false
    },
    toolRegistry: Object.entries(WAVE2_TOOL_REGISTRY).map(([id, value]) => ({
      id,
      risk: value.risk,
      writes: value.writes,
      external: value.external
    })),
    routes: [
      '/api/v1/runtime/v2/status',
      '/api/v1/runtime/v2/agent/plan',
      '/api/v1/runtime/v2/tools/lease-proposal',
      '/api/v1/runtime/v2/approvals/classify',
      '/api/v1/runtime/v2/rollback/plan',
      '/api/v1/runtime/v2/idempotency/inspect',
      '/api/v1/runtime/v2/emergency-stop',
      '/api/v1/runtime/v2/observability'
    ]
  };
}
