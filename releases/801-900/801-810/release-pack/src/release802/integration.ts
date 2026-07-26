export const RELEASE_802_INTEGRATION = Object.freeze({
  release: 802,
  capability: "Tenant Boundary Enforcement Middleware",
  featureFlag: "release_802_enabled",
  defaultEnabled: false,
  requiredMiddleware: [
    "request_context",
    "authentication",
    "tenant_resolution",
    "authorisation",
    "schema_validation",
    "budget_and_rate_limit",
    "audit_metadata"
  ],
  productionMigrationAutomatic: false,
  autonomousProductionWritesEnabled: false,
  killSwitchRequired: true
});
