export const RELEASE_893_INTEGRATION = Object.freeze({
  release: 893,
  capability: "D1 Migration Implementation and Rehearsal v6",
  featureFlag: "release_893_enabled",
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
