export const RELEASE_849_INTEGRATION = Object.freeze({
  release: 849,
  capability: "Workspace Export Deletion and Portability",
  featureFlag: "release_849_enabled",
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
