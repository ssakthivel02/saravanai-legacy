# Owner Build 017 — endpoint authorisation foundation

## Objective

Build 017 adds a server-side, least-privilege route catalogue and authorisation middleware after the exact-email role-policy foundation. It prepares owner, member and reader endpoint decisions without activating production enforcement.

## Delivered

- Explicit public, shared-work, owner-only and server-mutation route classifications.
- Default denial for unclassified routes when enforcement is enabled.
- Cryptographically verified role requirement for protected routes.
- Separate mutation gate for server-changing operations.
- Safe JSON denial responses with request identifiers and no identity disclosure.
- Metadata-only decision evidence contract.
- Build 017 platform-release overlay and live Owner & Access panel.
- Primary and dedicated OpenAPI contracts.
- Focused unit tests, structural validation and exact-head CI.

## Safety statements

- Route authorisation remains disabled by default.
- Server mutations remain disabled by default.
- No Cloudflare Access setting is changed automatically.
- No audit event is persisted.
- Public registration remains disabled.
- Invitations remain disabled.
- D1 migrations and shared writes are not executed.
- Paid providers and paid fallback remain disabled.
- No configured email, JWT, Access AUD or profile key is returned by the readiness endpoint.

## Activation order

1. Complete the exact-email owner-only Cloudflare Access pilot.
2. Verify Worker JWT signature, issuer, audience and owner email.
3. Enable endpoint authorisation only in a controlled test environment.
4. Test public status, owner security, member work, reader denial and unknown-route denial.
5. Keep server mutations disabled.
6. Design D1 tenant persistence, audit retention and rollback before any mutation activation.

## Definition of done

The build is complete when all existing tests, Build 017 focused tests, structural validators and disabled-default checks pass on the exact PR head.
