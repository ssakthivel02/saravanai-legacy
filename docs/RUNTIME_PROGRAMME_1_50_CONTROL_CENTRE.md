# SakthiAI Runtime Programme 1–50 Control Centre

## Purpose

This tranche consolidates the fifty existing runtime assurance waves into one private-owner operating view without changing the safety posture of any wave. It adds a server-rendered control-centre page, owner-only JSON status, repository evidence validation, a read-only smoke-test plan, a non-executing release gate and a manual rollback plan.

## Endpoints

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/v1/runtime/programme/status` | Public, safe metadata | Returns counts and global disabled controls only |
| `GET /api/v1/runtime/programme/control-centre` | Cloudflare Access owner | Returns the complete 1–50 state matrix |
| `GET /runtime/control-centre` | Cloudflare Access owner | Server-rendered, script-free dashboard |
| `POST /api/v1/runtime/programme/evidence/validate` | Cloudflare Access owner | Validates supplied repository/CI evidence metadata |
| `POST /api/v1/runtime/programme/smoke/plan` | Cloudflare Access owner | Produces a 52-endpoint read-only smoke plan |
| `POST /api/v1/runtime/programme/release/gate` | Cloudflare Access owner | Produces an advisory manual-merge eligibility decision |
| `POST /api/v1/runtime/programme/rollback/plan` | Cloudflare Access owner | Produces a non-executing rollback sequence |

## Architecture

Request routing is added before the existing Wave 1 catch-all route. The programme module is self-contained and has no outbound fetch client, database adapter, queue producer, notification client, AI invocation, GitHub write client, payment integration or deployment executor.

The control centre evaluates only:

- Environment-variable presence and boolean safety state
- Existing runtime enable and emergency-stop flags
- Caller-supplied evidence metadata
- Caller-supplied release-readiness declarations
- Static release evidence stored in the repository

It never displays `OWNER_EMAIL`, JWT assertions, provider tokens, secrets or submitted evidence content.

## State model

Every wave is projected as:

- `enabled`
- `emergencyStopped`
- `operational`
- `enableVariablePresent`
- `emergencyStopVariablePresent`

Absence of an enable variable means disabled. Absence of an emergency-stop variable means stopped. A wave becomes operational only when it is explicitly enabled and its emergency stop is explicitly set to false.

## Security controls

- Exact Cloudflare Access email plus JWT assertion
- Exact encrypted `OWNER_EMAIL` equality
- Strict no-store response headers
- Script-free dashboard
- Same-origin resource policy
- Frame denial
- No referrer
- Browser permissions disabled
- 128 KiB bounded JSON inputs
- Bounded evidence arrays
- HTTPS-only smoke-plan base URLs
- No secret values returned
- No persistence

## Programme safety findings

The control centre reports attention when any of these are enabled:

- Public registration
- Public tenant writes
- Unified billing
- Billing or payments
- Premium or paid providers
- Autonomous production writes
- External tool execution
- Per-wave write, paid-provider or public-registration flags

Operational waves are reported separately and require a dedicated owner-pilot review. The programme gate does not automatically disable or alter anything.

## Evidence model

The committed evidence index records merged PRs, merge commits and focused test counts for Waves 1–50. It is repository metadata only and must not be described as certification, external audit evidence or proof of live production configuration.

## Accessibility

The dashboard uses semantic headings, tables, definition lists, high-contrast colours, responsive layout and no client-side scripting. It does not depend on animation, pointer-only interaction or colour alone.

## Acceptance criteria

- All fifty waves appear exactly once.
- All waves default disabled, stopped and non-operational.
- No owner identity or secret is rendered.
- The smoke plan includes health, fifty wave statuses and programme status.
- The programme release gate cannot approve, merge or deploy.
- The rollback plan cannot alter variables or deployments.
- Existing Wave 1–50 tests continue to pass.
- The existing SakthiAI quality gate continues to pass.
