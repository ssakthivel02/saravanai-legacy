export const RELEASE_834_INTEGRATION = Object.freeze({
  release: 834,
  capability: "Hybrid Retrieval Ranking and Freshness Policy",
  featureFlag: "release_834_enabled",
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
