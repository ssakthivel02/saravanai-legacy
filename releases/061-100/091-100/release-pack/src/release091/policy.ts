import type { AgentNode } from "./model";

export const RELEASE_091_CONTROL_RULES = ["capability_allowlist_required", "delegation_depth_bounded", "maximum_steps_bounded", "production_write_must_be_false", "suspended_agent_denied"] as const;

export function validateAgentNode(input: AgentNode): string[] {
  const errors: string[] = [];
  if (!String(input.agentId ?? "").trim()) errors.push("agentId_required");
  if (!input.capabilities.length) errors.push("capabilities_required");
  if (input.productionWriteAllowed !== false) errors.push("productionWriteAllowed_must_be_false");
  return [...new Set(errors)];
}

export function release091Ready(input: AgentNode): boolean {
  return validateAgentNode(input).length === 0;
}
