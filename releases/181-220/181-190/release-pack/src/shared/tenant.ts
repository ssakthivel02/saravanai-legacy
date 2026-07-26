import type { RuntimeContext } from "./context";

export function trustedTenant(ctx: RuntimeContext): string {
  if (!ctx.actor?.tenantId) throw new Error("trusted_tenant_context_required");
  return ctx.actor.tenantId;
}

export function enforceTenant(ctx: RuntimeContext, targetTenantId: string): void {
  if (!ctx.actor?.roles.includes("owner") && trustedTenant(ctx) !== targetTenantId) {
    throw new Error("cross_tenant_access_denied");
  }
}
