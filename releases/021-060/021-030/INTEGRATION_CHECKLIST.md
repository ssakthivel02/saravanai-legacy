# Integration checklist

## Before copying

- [ ] Pull the latest `main`.
- [ ] Confirm the latest baseline includes Releases 012–020.
- [ ] Create branch `feature/releases-021-030-enterprise-runtime`.
- [ ] Back up the repository.

## After copying

- [ ] Review all environment variables in `release-pack/config/environment.schema.json`.
- [ ] Keep `PUBLIC_REGISTRATION_ENABLED=false`.
- [ ] Keep `PRODUCTION_WRITES_ENABLED=false`.
- [ ] Keep all paid-provider feature flags false.
- [ ] Apply D1 migrations only to a non-production database first.
- [ ] Wire the route modules into the current Worker router.
- [ ] Run existing tests and the release-pack validator.
- [ ] Review threat models and risk acceptances.
- [ ] Obtain explicit Release 030 go/no-go approval before production deployment.
