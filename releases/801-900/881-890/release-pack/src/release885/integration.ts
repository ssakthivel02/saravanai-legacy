export const RELEASE_885_INTEGRATION = Object.freeze({
  release: 885,
  capability: "FinOps Allocation and Showback without Billing",
  featureFlag: "release_885_enabled",
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
