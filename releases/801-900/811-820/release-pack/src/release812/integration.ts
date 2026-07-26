export const RELEASE_812_INTEGRATION = Object.freeze({
  release: 812,
  capability: "Provider Adapter Execution Contract v2",
  featureFlag: "release_812_enabled",
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
