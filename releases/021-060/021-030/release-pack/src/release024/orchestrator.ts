import { AGENTS, type AgentName } from "./agents";

export interface AgentTask {
  taskId: string;
  agent: AgentName;
  objective: string;
  step: number;
  status: "queued" | "running" | "blocked" | "completed" | "failed";
}

export function validateTask(task: AgentTask): string[] {
  const errors: string[] = [];
  const definition = AGENTS[task.agent];
  if (!definition) errors.push("unknown_agent");
  if (!task.objective.trim()) errors.push("objective_required");
  if (definition && task.step > definition.maxSteps) errors.push("max_steps_exceeded");
  return errors;
}
