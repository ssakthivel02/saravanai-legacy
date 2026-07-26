export const RELEASE_829_INTEGRATION = Object.freeze({
  release: 829,
  capability: "Agent Behaviour Evaluation and Drift Response",
  featureFlag: "release_829_enabled",
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
