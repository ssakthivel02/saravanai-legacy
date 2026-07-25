# SakthiAI Release 011 — Owner Security and Global Safety Baseline

## Purpose

Release 011 hardens the private single-owner build before any server identity, public registration or team access is enabled. It also records a global safety baseline for future agents, tools, public-event guidance and country-specific use.

## Implemented security controls

1. Browser-local owner privacy lock.
2. Minimum 12-character owner passphrase.
3. PBKDF2-SHA-256 passphrase verifier with 250,000 iterations and random salt.
4. Session auto-lock after ten minutes of inactivity.
5. Manual lock control.
6. Sensitive owner sections blurred and made inert while locked.
7. Full owner backups encrypted locally with AES-256-GCM.
8. Project backups encrypted locally with AES-256-GCM.
9. Export passphrase is never stored or sent to the Worker.
10. Plaintext project and owner export handlers are intercepted.
11. Destructive reset requires the owner passphrase.
12. Destructive reset also requires the exact phrase `DELETE LOCAL DATA`.
13. Temporary file-ingestion token is cleared on page exit.
14. Kimi is disabled by owner policy and cannot be routed.
15. Premium budget selection is disabled in the UI.
16. Paid providers require both a feature flag and an explicit owner acknowledgement value.
17. Unified Billing is not required or enabled.
18. Root `/health` returns dedicated no-cache JSON.
19. `/health` executes Worker code before static-asset fallback.
20. Release labels and health metadata are aligned to Release 011.

## Important security boundary

IndexedDB and localStorage are isolated by browser origin and browser profile. A visitor using the public URL from another device receives a separate empty local database and cannot export the owner's browser-local records.

The remaining risks are:

- another person using the same unlocked browser profile;
- malicious browser extensions;
- device compromise;
- developer-tools access;
- cross-site scripting introduced by a future code regression;
- loss of the device or clearing of browser storage.

The local privacy lock reduces casual same-device exposure but is not server authentication. Confidential or regulated information must wait for Cloudflare Access/OIDC, D1 tenant enforcement and production security validation.

## Global safety and security — 38-control standard

### Identity, privacy and data

1. No public registration before identity launch gates pass.
2. No provider keys in browser code or storage.
3. Detect and reject credential-shaped prompts.
4. Encrypt portable owner backups.
5. Minimise retained data and expose deletion/export controls.
6. Keep tenant data isolated server-side before teams are enabled.
7. Use purpose limitation for memory and require owner approval.
8. Apply expiry to sensitive memory where practical.

### Model and information integrity

9. Current facts require fresh evidence.
10. Prefer official and primary sources for high-impact claims.
11. Display searched-at timestamps and citations.
12. Separate verified facts, inference and uncertainty.
13. Refuse stale answers when current evidence is unavailable.
14. Record provider, model, route, latency and request ID.
15. Treat generated documents and code as drafts requiring review.
16. Test multilingual output, including Tamil and English.

### Tools and automation

17. External writes require explicit human approval.
18. Use dry-run mode before execution.
19. Require idempotency keys for repeatable writes.
20. Record append-only audit events.
21. Define rollback before production actions.
22. Block DNS, deployment and administrative actions without elevated approval.
23. Restrict tools with allowlists and least privilege.
24. Never claim execution without tool evidence.

### Cost and operational resilience

25. Default to free-first routing.
26. Block Kimi and all commercial providers under the present owner policy.
27. Require dual configuration before any future paid-provider activation.
28. Use server-enforced quotas before public access.
29. Fail closed for security-critical Worker routes.
30. Monitor errors, rate limits and free-allocation exhaustion.
31. Preserve offline/PWA recovery without caching private API responses.
32. Maintain tested backup, restore and disaster-recovery procedures.

### Countries, communities and public celebrations

33. State that local law, emergency services and organiser instructions take precedence.
34. For festivals and celebrations, prioritise crowd capacity, emergency access, weather, transport, accessibility and safeguarding.
35. Treat fireworks, pyrotechnics, temporary electrical systems, cooking fuel and structures as regulated high-risk activities requiring licensed professionals and local approval.
36. Protect children and vulnerable people through lost-person, supervision, consent and safe-contact procedures.
37. Respect religious, cultural and national differences; avoid stereotyping and do not present one country's rules as universal.
38. For imminent danger, medical emergency, violence, fire or missing persons, direct users to local emergency services rather than relying on AI instructions.

## Services intentionally not enabled

- Unified Billing
- OpenAI billing
- Claude billing
- Gemini billing
- Kimi
- Workers Paid plan
- AI Search solely for testing
- Public registration

## Next implementation gate

Release 012 should focus on authenticated private owner access and server persistence only after the owner decides to create the optional Cloudflare Access and D1 resources. Until then, the browser-local Release 011 workspace remains the supported mode.
