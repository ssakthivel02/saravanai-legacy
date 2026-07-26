export type AgentName =
  | "researcher" | "architect" | "developer" | "security"
  | "compliance" | "reviewer" | "tester" | "documentation"
  | "release" | "operations";

export interface AgentDefinition {
  name: AgentName;
  allowedTools: string[];
  maxSteps: number;
  requiresApprovalFor: string[];
  canWriteProduction: false;
}

export const AGENTS: Record<AgentName, AgentDefinition> = {
  researcher: { name: "researcher", allowedTools: ["web.search", "knowledge.read"], maxSteps: 8, requiresApprovalFor: [], canWriteProduction: false },
  architect: { name: "architect", allowedTools: ["knowledge.read", "artifact.draft"], maxSteps: 8, requiresApprovalFor: [], canWriteProduction: false },
  developer: { name: "developer", allowedTools: ["repo.read", "artifact.draft", "test.run"], maxSteps: 12, requiresApprovalFor: ["repo.write"], canWriteProduction: false },
  security: { name: "security", allowedTools: ["repo.read", "evidence.read", "test.run"], maxSteps: 10, requiresApprovalFor: ["policy.write"], canWriteProduction: false },
  compliance: { name: "compliance", allowedTools: ["policy.read", "evidence.read"], maxSteps: 8, requiresApprovalFor: ["control.attest"], canWriteProduction: false },
  reviewer: { name: "reviewer", allowedTools: ["artifact.read", "test.read"], maxSteps: 6, requiresApprovalFor: ["approval.decide"], canWriteProduction: false },
  tester: { name: "tester", allowedTools: ["test.run", "artifact.read"], maxSteps: 10, requiresApprovalFor: [], canWriteProduction: false },
  documentation: { name: "documentation", allowedTools: ["artifact.read", "artifact.draft"], maxSteps: 8, requiresApprovalFor: [], canWriteProduction: false },
  release: { name: "release", allowedTools: ["evidence.read", "release.plan"], maxSteps: 8, requiresApprovalFor: ["deploy.production"], canWriteProduction: false },
  operations: { name: "operations", allowedTools: ["health.read", "incident.create"], maxSteps: 8, requiresApprovalFor: ["incident.execute"], canWriteProduction: false }
};
