import type { Decision, RequestContext } from "../shared/types";
import { secureId } from "../shared/ids";

export const SYSTEM_ROLES = {
  owner: ["*"],
  securityAdmin: ["identity:read", "identity:write", "audit:read", "policy:read"],
  tenantAdmin: ["tenant:read", "tenant:write", "member:read", "member:write"],
  reviewer: ["approval:read", "approval:decide", "evidence:read"],
  member: ["workspace:read", "workspace:use"],
  auditor: ["audit:read", "evidence:read", "policy:read"]
} as const;

export function authorise(ctx: RequestContext, permission: string): Decision {
  if (!ctx.actor) {
    return { allowed: false, reason: "authentication_required", obligations: [], decisionId: secureId("dec") };
  }
  const granted = ctx.actor.roles.some(role => {
    const permissions = SYSTEM_ROLES[role as keyof typeof SYSTEM_ROLES] ?? [];
    return permissions.includes("*" as never) || permissions.includes(permission as never);
  });
  return {
    allowed: granted,
    reason: granted ? "role_permission_granted" : "permission_denied",
    obligations: granted ? ["audit_decision"] : ["audit_denial"],
    decisionId: secureId("dec")
  };
}

export function requireTenantBoundary(ctx: RequestContext, targetTenantId: string): Decision {
  const owner = ctx.actor?.roles.includes("owner");
  const sameTenant = Boolean(ctx.actor?.tenantId && ctx.actor.tenantId === targetTenantId);
  return {
    allowed: Boolean(owner || sameTenant),
    reason: owner ? "owner_override" : sameTenant ? "same_tenant" : "cross_tenant_denied",
    obligations: ["audit_decision"],
    decisionId: secureId("dec")
  };
}
