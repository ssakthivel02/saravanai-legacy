export const RELEASE_872_INTEGRATION = Object.freeze({
  release: 872,
  capability: "Simulation Scenario and Assumption Contract",
  featureFlag: "release_872_enabled",
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
