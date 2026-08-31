import type { RuntimeContext } from "./contracts";
export function requireTenant(ctx: RuntimeContext): string {
  if (!ctx.actor?.tenantId) throw new Error("trusted_tenant_context_required");
  return ctx.actor.tenantId;
}
export function assertSameTenant(ctx: RuntimeContext, targetTenantId: string): void {
  const owner = ctx.actor?.roles.includes("owner");
  if (!owner && requireTenant(ctx) !== targetTenantId) throw new Error("cross_tenant_access_denied");
}
