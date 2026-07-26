export interface AgentNode {
  agentId: string;
  tenantId: string;
  role: string;
  capabilities: string[];
  delegationDepth: number;
  maximumSteps: number;
  productionWriteAllowed: false;
  status: "registered" | "active" | "suspended" | "retired";
}

export const RELEASE_091 = {
  id: "091",
  title: "Governed Agent Mesh",
  objective: "Coordinate specialist agents through signed delegation, least privilege, tenant boundaries, bounded steps and human approval.",
  resource: "agent-nodes"
} as const;
