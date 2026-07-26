# SakthiAI Runtime Wave 1 Implementation

## Scope

This pack implements the first secure runtime tranche from Releases 801–900:

- Release 801 — trusted Runtime Identity Context
- Release 802 — Tenant Boundary Enforcement
- Release 804 — deny-by-default RBAC/ABAC policy decisions
- Release 811 — free-first AI Request Envelope
- Release 815 — Output Validation and Safety
- Release 819 — privacy-safe Runtime Observability

## What becomes functional

The Worker gains six `/api/v1/runtime/*` routes. The status route is safe and
read-only. All other routes require Cloudflare Access plus exact `OWNER_EMAIL`
matching. The AI envelope validates and hashes prompt content but does not execute
a model. The output checker does not persist output content.

## What remains disabled

- Public registration
- Server tenant writes
- Autonomous production writes
- D1 writes from these routes
- Billing, payments and Unified Billing
- Silent paid-provider activation
- Agent execution and external tools
- Unsupported certification claims

## Required environment configuration

Set these through Cloudflare, not source control:

- `OWNER_EMAIL` — the same owner identity used by governance access
- `RUNTIME_WAVE1_ENABLED` — keep `false` until the PR passes and the owner pilot is approved
- `RUNTIME_WAVE1_WRITES_ENABLED` — do not create or enable this flag in Wave 1

## Activation order

1. Merge with `RUNTIME_WAVE1_ENABLED=false`.
2. Confirm existing SakthiAI validation and Runtime Wave 1 validation pass.
3. Confirm Cloudflare Access protects the private routes.
4. Test `/api/v1/runtime/status`.
5. Set `OWNER_EMAIL` if not already configured.
6. Set `RUNTIME_WAVE1_ENABLED=true` for the owner-only pilot.
7. Run the smoke tests in `RUNTIME_WAVE_1_ROLLOUT_AND_ROLLBACK.md`.
8. Keep the D1 migration unexecuted until a separate migration PR.
