export const RELEASE_888_INTEGRATION = Object.freeze({
  release: 888,
  capability: "Provider Contract Exit and Portability Readiness",
  featureFlag: "release_888_enabled",
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
