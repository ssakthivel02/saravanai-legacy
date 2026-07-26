export const RELEASE_877_INTEGRATION = Object.freeze({
  release: 877,
  capability: "Resilience Failure and Recovery Simulation",
  featureFlag: "release_877_enabled",
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
