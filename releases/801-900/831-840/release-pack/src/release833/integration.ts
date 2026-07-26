export const RELEASE_833_INTEGRATION = Object.freeze({
  release: 833,
  capability: "Tenant-Scoped Index and Retrieval Runtime",
  featureFlag: "release_833_enabled",
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
