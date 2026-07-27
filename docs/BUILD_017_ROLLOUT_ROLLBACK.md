# Build 017 rollout and rollback

## Rollout prerequisites

- Google identity-provider test succeeds.
- Whole-host Cloudflare Access owner policy is configured.
- Allowed owner account succeeds.
- Alternate account is denied.
- Worker `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` and owner allow list are verified.
- JWT enforcement is healthy.

## Controlled rollout

1. Deploy Build 017 with route authorisation disabled.
2. Confirm `/health`, `/api/v1/platform/release` and `/api/v1/platform/access/authorisation`.
3. Validate the route catalogue in a non-production environment.
4. Set `ACCESS_ROUTE_AUTHORIZATION_ENABLED=true`.
5. Test owner, member and reader matrices.
6. Confirm unknown routes deny.
7. Leave `ACCESS_SERVER_MUTATIONS_ENABLED` false.

## Rollback

1. Set `ACCESS_ROUTE_AUTHORIZATION_ENABLED=false`.
2. Do not disable the verified owner Cloudflare Access policy unless owner lockout requires the documented Access rollback.
3. Confirm platform and AI routes return to the previous JWT-only behaviour.
4. Review request identifiers and test evidence.
5. Correct the catalogue or role policy before another attempt.

No data migration or audit persistence is created, so Build 017 rollback requires no database reversal.
