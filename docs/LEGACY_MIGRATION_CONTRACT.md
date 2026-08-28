# Saravan legacy migration contract

Target legacy identity: **Saravan**
Target domain: `saravan.omsaravanabhava.org`
Source product: SakthiAI

## Non-negotiable controls
- Preserve Git history; no force-push or history rewrite.
- Do not commit API keys, credentials, tokens, personal data, build secrets, or provider secrets.
- Do not rename runtime/provider/internal identifiers merely for visual branding.
- Preserve current owner-mode access boundaries, approval controls, memory boundaries, usage controls, and free-first routing behaviour.
- Preserve legal, privacy, accessibility, security and PWA behaviour unless a change is explicitly validated.
- Keep production `main` unchanged until the legacy branch has build/route/CI evidence.
- DNS cutover occurs only after repository validation and must be reversible.

## Migration scope
1. Legacy domain/CNAME.
2. Public-facing Saravan branding, canonical metadata, manifest/PWA identity and social metadata.
3. Existing SakthiAI functionality retained unless a defect is independently fixed and tested.
4. No claims of production readiness until live-domain smoke tests pass.
