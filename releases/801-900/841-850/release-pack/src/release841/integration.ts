export const RELEASE_841_INTEGRATION = Object.freeze({
  release: 841,
  capability: "Customer Workspace Tenant Provisioning",
  featureFlag: "release_841_enabled",
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
