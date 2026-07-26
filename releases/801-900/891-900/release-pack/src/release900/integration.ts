export const RELEASE_900_INTEGRATION = Object.freeze({
  release: 900,
  capability: "SakthiAI Enterprise Platform v8 Completion Gate",
  featureFlag: "release_900_enabled",
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
