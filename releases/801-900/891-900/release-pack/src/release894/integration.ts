export const RELEASE_894_INTEGRATION = Object.freeze({
  release: 894,
  capability: "Secrets Bindings and Environment Readiness v2",
  featureFlag: "release_894_enabled",
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
