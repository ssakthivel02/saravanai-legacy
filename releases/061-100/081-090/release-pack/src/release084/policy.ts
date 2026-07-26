import type { EventSafetyPlan } from "./model";

export const RELEASE_084_CONTROL_RULES = ["local_emergency_contacts_required", "crowd_plan_required", "weather_plan_required", "accessibility_plan_required", "child_safety_plan_required", "owner_approval_required"] as const;

export function validateEventSafetyPlan(input: EventSafetyPlan): string[] {
  const errors: string[] = [];
  if (!String(input.planId ?? "").trim()) errors.push("planId_required");
  if (!input.emergencyContacts.length) errors.push("emergencyContacts_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  return [...new Set(errors)];
}

export function release084Ready(input: EventSafetyPlan): boolean {
  return validateEventSafetyPlan(input).length === 0;
}
