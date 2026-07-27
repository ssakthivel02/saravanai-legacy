# Runtime Programme 1–50 Rollout and Rollback

## Merge boundary

This tranche requires no database migration and introduces no new enable or emergency-stop variable.

At merge time:

- Do not add any `RUNTIME_WAVE*_ENABLED` variable.
- Do not add any `RUNTIME_WAVE*_EMERGENCY_STOP` variable.
- Do not enable public registration.
- Do not enable billing, payments, paid providers or Unified Billing.
- Do not enable public or production writes.
- Do not enable external tool execution or autonomous actions.

## Pre-merge gate

1. Confirm the PR head SHA has not moved.
2. Confirm every GitHub Actions check is successful on that exact SHA.
3. Confirm the existing SakthiAI quality gate passes.
4. Confirm regressions for Waves 1–50 pass.
5. Confirm the 52-endpoint offline smoke script passes.
6. Confirm no migration file is introduced.
7. Review the evidence index and rollback sequence.
8. Merge manually only after owner review.

## Post-merge verification

After Cloudflare deploys `main`, use read-only requests:

- `/health`
- `/api/v1/runtime/programme/status`
- `/api/v1/runtime/status`
- `/api/v1/runtime/v11/status`
- `/api/v1/runtime/v30/status`
- `/api/v1/runtime/v50/status`

Expected state:

- `status: ok`
- programme total: 50
- operational waves: 0
- wave `enabled: false`
- wave emergency stop true where the field exists
- public registration false
- production writes false
- paid providers false
- billing false

The private dashboard requires Cloudflare Access and the exact encrypted `OWNER_EMAIL`:

- `/runtime/control-centre`

## Rollback triggers

Rollback when any of these occurs:

- Production build failure
- Status endpoint routing regression
- Authentication bypass
- Owner identity exposure
- A dangerous capability reports true
- Existing Wave 1–50 regression failure
- Unexpected 5xx response from existing runtime endpoints
- CSP or no-store headers are missing from the control centre

## Manual rollback

1. Preserve or restore runtime emergency-stop settings.
2. Remove any enable flag introduced outside this tranche.
3. Select the previous known-good Cloudflare deployment.
4. Confirm the deployment commit matches repository evidence.
5. Roll traffic back manually.
6. Run the read-only smoke checks.
7. Record the result without storing secrets or request content.

## Explicit non-actions

The code does not:

- Call Cloudflare APIs
- Roll back a deployment
- Modify Worker variables
- Send alerts
- Create incidents
- Update GitHub
- Execute migrations
- Write to D1 or R2
- Invoke AI models
- Charge customers
