export const RELEASE_827_INTEGRATION = Object.freeze({
  release: 827,
  capability: "Compensating Action and Rollback Executor",
  featureFlag: "release_827_enabled",
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
