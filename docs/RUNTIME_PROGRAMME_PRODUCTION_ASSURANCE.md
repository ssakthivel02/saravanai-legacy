# SakthiAI Runtime Programme Production Assurance

## Purpose

This control pack verifies that the deployed SakthiAI runtime programme remains safe after merges and Cloudflare deployments. It covers `/health`, the programme summary and the public status endpoint for Runtime Waves 1 through 50.

## Assurance principles

- Read-only HTTP `GET` requests only.
- No credentials, cookies, secrets or Cloudflare Access tokens are transmitted.
- No runtime wave is enabled.
- No emergency stop is removed.
- No migration is executed.
- No prompt, model, tool or agent is invoked.
- No database, repository, queue, notification, deployment or infrastructure write is performed.
- No billing, payments, paid providers or public registration are enabled.
- No evidence is written back to the production Worker.

## Validation modes

### Pull-request validation

Every relevant pull request runs:

1. The existing SakthiAI quality gate.
2. Focused production-assurance unit tests.
3. JavaScript syntax validation.
4. Generation of a deterministic 52-endpoint dry-run plan.
5. Upload of the plan as a short-retention GitHub Actions artifact.

No production request is made during ordinary pull-request validation.

### Manual live verification

The workflow can be started manually with `run_live_smoke=true`. It checks:

- `GET /health`
- `GET /api/v1/runtime/programme/status`
- `GET /api/v1/runtime/v1/status` through `GET /api/v1/runtime/v50/status`

The workflow fails when any endpoint is unavailable, returns a non-JSON response or reports an unsafe state.

## Required safe state

The programme summary must report:

- `totalWaves: 50`
- `operationalCount: 0`
- `publicRegistration: false`
- `productionWritesEnabled: false`
- `billingEnabled: false`
- `paidProvidersEnabled: false`
- `autonomousActionsEnabled: false`

Each wave must report:

- `enabled: false`
- `operational: false`
- `publicRegistration: false`

Waves 2 through 50 must additionally report:

- `emergencyStopped: true`

Wave 1 predates the shared emergency-stop contract, so the checker does not require that field for Wave 1.

## Evidence and retention

Dry-run plans are retained for 14 days. Manually generated live reports are retained for 30 days. Artifacts contain endpoint status metadata only and must not contain secrets, personal data or request credentials.

## Failure response

A failed live smoke run does not perform rollback automatically. The owner must:

1. Review the failed endpoint and finding.
2. Confirm the active Cloudflare deployment and related GitHub commit.
3. Keep all runtime enable flags absent or false.
4. Keep all emergency stops present or defaulted to stopped.
5. Roll back through the Cloudflare deployment history only after human review.
6. Re-run the manual live smoke workflow after remediation.

## Cost boundary

The implementation uses GitHub Actions and read-only HTTP checks. It does not activate Cloudflare paid features, AI providers, payment services or external monitoring subscriptions. Usage remains subject to the existing free-tier limits of the connected platforms.
