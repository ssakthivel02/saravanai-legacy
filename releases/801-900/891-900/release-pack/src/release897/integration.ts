export const RELEASE_897_INTEGRATION = Object.freeze({
  release: 897,
  capability: "Controlled Tenant Pilot and Exit Criteria",
  featureFlag: "release_897_enabled",
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
