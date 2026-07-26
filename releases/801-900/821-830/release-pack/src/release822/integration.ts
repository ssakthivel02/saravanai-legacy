export const RELEASE_822_INTEGRATION = Object.freeze({
  release: 822,
  capability: "Agent Plan Compiler and Static Validator",
  featureFlag: "release_822_enabled",
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
