export const RELEASE_875_INTEGRATION = Object.freeze({
  release: 875,
  capability: "Scenario Comparison and Sensitivity Analysis",
  featureFlag: "release_875_enabled",
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
