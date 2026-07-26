export const RELEASE_880_INTEGRATION = Object.freeze({
  release: 880,
  capability: "Digital Twin and Simulation Activation Gate",
  featureFlag: "release_880_enabled",
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
