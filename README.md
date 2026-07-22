# Sakthi AI Nexus

Private, provider-independent AI orchestration workspace.

## Release 001 — Web/PWA foundation

This release intentionally contains **no live AI provider integration and no API credentials**. It establishes:

- Responsive website and installable PWA shell
- Overview, workspace simulation, research, governance and roadmap views
- Offline fallback and service worker
- Cloudflare Pages security headers and redirects
- Automated validation/build workflow
- Evidence-first product language with no false "live" status claims

## Local verification

Requirements: Node.js 20 or later.

```bash
npm test
python -m http.server 4173 -d dist
```

Open `http://localhost:4173`.

## Cloudflare Pages

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Production branch: `main`
- Recommended Node version: `22`

See [`docs/CLOUDFLARE_DEPLOYMENT.md`](docs/CLOUDFLARE_DEPLOYMENT.md).

## Security rule

Never commit provider keys. Future provider calls must run server-side through a Worker/API layer, not from browser JavaScript.
