export const RELEASE_832_INTEGRATION = Object.freeze({
  release: 832,
  capability: "Document Ingestion and Quarantine Worker",
  featureFlag: "release_832_enabled",
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
