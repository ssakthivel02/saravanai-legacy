import type { RuntimeContext } from "./contracts";

export function trustedTenant(ctx: RuntimeContext): string {
  if (!ctx.actor?.tenantId) throw new Error("trusted_tenant_context_required");
  return ctx.actor.tenantId;
}

export function assertTenant(ctx: RuntimeContext, targetTenant: string): void {
  const owner = ctx.actor?.roles.includes("owner");
  if (!owner && trustedTenant(ctx) !== targetTenant) throw new Error("cross_tenant_access_denied");
}
