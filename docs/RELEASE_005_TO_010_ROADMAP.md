# SakthiAI Releases 005–010 implementation roadmap

## Release 005 — Projects, conversations and usage ledger
- D1 schema for projects, conversations, messages, saved research and usage events.
- Retention, export and deletion APIs.
- Anonymous local-only mode remains available until identity is enabled.

## Release 006 — Identity, teams, tenants and RBAC
- Cloudflare Access/OIDC compatible authentication boundary.
- User, team and tenant isolation.
- Roles: owner, admin, member, viewer, auditor.
- Session, invitation and audit APIs.

## Release 007 — Artifact Studio
- DOCX, PDF, XLSX, PPTX and source-code package generation.
- Artifact manifest, checksum, source provenance and expiry.
- R2 private artifact storage.

## Release 008 — Tools and approvals
- Tool registry and allowlists.
- Human approval before email, GitHub, deployment, DNS or administrative writes.
- Idempotency keys, dry-run mode, rollback and append-only audit events.

## Release 009 — Memory and knowledge graph
- User-approved memories only.
- Semantic retrieval, entity/relationship model and provenance.
- Memory review, edit, expiration and deletion.

## Release 010 — Cost controls and mobile clients
- Per-user, per-team and per-provider quotas.
- Spend alerts, model-cost comparison and denial-of-wallet controls.
- Stable public API contract for Android and iOS clients.
- PWA remains the first mobile delivery surface.

## Delivery rule

Implementation proceeds release by release behind feature flags. Paid providers remain optional. Free-tier and open-source components are the default wherever they satisfy security, quality and operational requirements.
