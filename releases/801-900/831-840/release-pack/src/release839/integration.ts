export const RELEASE_839_INTEGRATION = Object.freeze({
  release: 839,
  capability: "Knowledge Correction Reindex and Notification",
  featureFlag: "release_839_enabled",
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
