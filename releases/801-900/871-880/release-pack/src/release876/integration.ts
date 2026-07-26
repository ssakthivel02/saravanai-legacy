export const RELEASE_876_INTEGRATION = Object.freeze({
  release: 876,
  capability: "Operational Forecast and Capacity Simulation",
  featureFlag: "release_876_enabled",
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
