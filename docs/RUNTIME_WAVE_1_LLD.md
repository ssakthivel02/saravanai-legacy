# Runtime Wave 1 Low-Level Design

- `runtime/identity.js` resolves Access headers and exact configured owner match.
- `runtime/tenant.js` normalises tenant IDs and denies cross-tenant access.
- `runtime/policy.js` allowlists five read/dry-run actions and denies mutations.
- `runtime/ai-envelope.js` validates prompt size and secrets, hashes content and
  forces the Wave 1 provider decision to Workers AI.
- `runtime/output-safety.js` detects secret leakage, candidate PII and unsupported
  operational or certification claims.
- `runtime/observability.js` returns binding and control posture without content.
- `runtime-wave1.js` owns HTTP methods, authentication, routing and structured errors.
