export const RELEASE_883_INTEGRATION = Object.freeze({
  release: 883,
  capability: "Capacity Forecast and Admission Planning",
  featureFlag: "release_883_enabled",
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
