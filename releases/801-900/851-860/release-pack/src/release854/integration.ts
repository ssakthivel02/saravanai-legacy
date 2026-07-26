export const RELEASE_854_INTEGRATION = Object.freeze({
  release: 854,
  capability: "Audit Evidence Request and Access Workflow",
  featureFlag: "release_854_enabled",
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
