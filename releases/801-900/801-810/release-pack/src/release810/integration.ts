export const RELEASE_810_INTEGRATION = Object.freeze({
  release: 810,
  capability: "Identity and Tenant Runtime Activation Gate",
  featureFlag: "release_810_enabled",
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
