export const RELEASE_889_INTEGRATION = Object.freeze({
  release: 889,
  capability: "Economic Stress Test and Hard Stop Exercise",
  featureFlag: "release_889_enabled",
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
