export function enforceTenant(actorTenantId: string, targetTenantId: string, roles: string[] = []): void {
  if (!roles.includes("owner") && actorTenantId !== targetTenantId) {
    throw new Error("cross_tenant_access_denied");
  }
}
