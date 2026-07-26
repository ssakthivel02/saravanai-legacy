const TENANT_PATTERN = /^[a-z0-9][a-z0-9_-]{1,62}$/;

export function normaliseTenantId(value) {
  const candidate = typeof value === 'string'
    ? value.trim().toLowerCase()
    : '';
  return TENANT_PATTERN.test(candidate) ? candidate : '';
}

export function resolveTenantContext(request, identity) {
  const requestedTenant = normaliseTenantId(
    request.headers.get('x-sakthi-tenant')
  );

  // Wave 1 is deliberately single-owner and single-tenant.
  const tenantId = requestedTenant || 'owner';

  return {
    tenantId,
    mode: 'private-owner-single-tenant',
    publicRegistration: false,
    tenantWritesEnabled: false,
    ownerAuthorised: Boolean(identity.ownerAuthorised)
  };
}

export function enforceTenantBoundary(actorTenantId, targetTenantId) {
  const actor = normaliseTenantId(actorTenantId);
  const target = normaliseTenantId(targetTenantId);

  if (!actor || !target) {
    return {
      allowed: false,
      code: 'TENANT_ID_INVALID',
      reason: 'A valid tenant identifier is required.'
    };
  }

  if (actor !== target) {
    return {
      allowed: false,
      code: 'CROSS_TENANT_ACCESS_DENIED',
      reason: 'Cross-tenant access is denied.'
    };
  }

  return { allowed: true, code: 'TENANT_BOUNDARY_SATISFIED' };
}
