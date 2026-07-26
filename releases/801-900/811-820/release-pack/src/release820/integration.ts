export const RELEASE_820_INTEGRATION = Object.freeze({
  release: 820,
  capability: "AI Gateway Production Activation Gate",
  featureFlag: "release_820_enabled",
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
