export const RELEASE_806_INTEGRATION = Object.freeze({
  release: 806,
  capability: "API Key and Workload Identity Runtime",
  featureFlag: "release_806_enabled",
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
