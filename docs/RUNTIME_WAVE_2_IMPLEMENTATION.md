# SakthiAI Runtime Wave 2 Implementation

## Implemented controls

- Bounded agent plan compiler with a maximum of eight steps
- Strict step and tool allowlists
- Non-authoritative tool lease proposals
- Human-approval requirement classification
- Manual rollback and compensating-action plans
- Idempotency contract inspection
- Emergency-stop hard gate
- Privacy-safe observability

## Deliberate restrictions

Wave 2 cannot execute a tool, call an external service, grant an approval,
persist an idempotency key, alter a database, deploy code, send an email,
delete data or make a payment.

## Configuration

Keep these absent or false at merge time:

- `RUNTIME_WAVE2_ENABLED`
- `RUNTIME_WAVE2_EMERGENCY_STOP` defaults to stopped

An owner-only pilot would require both:

- `RUNTIME_WAVE2_ENABLED=true`
- `RUNTIME_WAVE2_EMERGENCY_STOP=false`

Do not enable the pilot until Wave 1 is deployed, stable and owner-tested.
