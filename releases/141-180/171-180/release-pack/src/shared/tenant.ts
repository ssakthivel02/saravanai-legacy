import type { RuntimeContext } from "./context";
export function enforceTenant(ctx: RuntimeContext, targetTenantId: string): void {
  if (!ctx.actor?.tenantId) throw new Error("trusted_tenant_context_required");
  if (!ctx.actor.roles.includes("owner") && ctx.actor.tenantId !== targetTenantId) {
    throw new Error("cross_tenant_access_denied");
  }
}
