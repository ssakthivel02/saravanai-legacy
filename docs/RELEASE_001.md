# Release 001 — Foundation

## Objective

Publish a trustworthy visual and deployment foundation at `sakthiai.omsaravanabhava.org` before adding paid or sensitive AI integrations.

## Included

1. Responsive single-page workspace
2. PWA manifest, service worker and offline page
3. Overview, workspace simulation, research, governance and roadmap
4. Security headers for Cloudflare Pages
5. Redirect aliases for major workspace areas
6. Node-based zero-dependency validation and build
7. GitHub Actions quality gate

## Deliberately excluded

- Provider API keys
- Live OpenAI, Claude, Gemini or Kimi calls
- User authentication
- Persistent conversation storage
- File upload
- Browser/computer control
- Email, GitHub, Azure or Cloudflare write actions
- Claims of GDPR certification or production readiness

## Acceptance criteria

- `npm test` passes
- `dist/` contains deployable assets
- No secrets or external JavaScript/CDN dependencies
- Mobile navigation works
- Theme preference persists
- Task router simulation works locally without a network call
- Offline fallback is registered only on HTTPS
- Cloudflare security headers are emitted from `_headers`
