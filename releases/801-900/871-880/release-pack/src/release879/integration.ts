export const RELEASE_879_INTEGRATION = Object.freeze({
  release: 879,
  capability: "Simulation Model Drift and Recalibration",
  featureFlag: "release_879_enabled",
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
