# Sakthi AI Nexus

Public, team-ready AI operating platform with provider-independent architecture.

## Release 002 — Live server-side AI beta

Release 002 promotes the original static foundation into a functional Cloudflare Worker application:

- Public and team-ready web workspace language
- Real server-side AI inference through a Cloudflare Workers AI binding
- Task modes for automatic, research, document, coding and website requests
- Same-origin API enforcement and prompt-size validation
- Worker Rate Limiting binding for public beta protection
- Runtime status, provider status, request IDs and latency disclosure
- Static assets and API routes deployed together from one Worker
- PWA cache excludes all `/api/*` responses
- No AI credentials stored in browser JavaScript or committed to Git

The live Release 002 model is `@cf/meta/llama-3.1-8b-instruct-fast`. OpenAI, Claude, Gemini and Kimi remain modular provider lanes for Release 003 after encrypted secrets, model policies, budgets, fallback and health checks are configured.

## API routes

- `GET /api/health`
- `GET /api/v1/status`
- `GET /api/v1/models`
- `POST /api/v1/chat`

Example request:

```json
{
  "prompt": "Create a secure migration plan for this application.",
  "mode": "automatic",
  "provider": "auto"
}
```

## Local verification

Requirements: Node.js 20 or later.

```bash
npm test
python -m http.server 4173 -d dist
```

Open `http://localhost:4173` for the static UI. Worker API and Workers AI binding validation require Wrangler remote development or a deployed preview.

## Cloudflare Worker deployment

- Build command: `npm test`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- Recommended Node version: `22`
- Static asset directory: `dist`
- Production branch: `main`
- Custom domain: `sakthiai.omsaravanabhava.org`

`wrangler.jsonc` is the deployment source of truth and configures static assets, API-first routing, Workers AI, rate limiting, observability and the custom domain.

## Security rule

Never commit provider keys. Premium provider credentials must be added as encrypted Cloudflare Worker secrets and accessed only by server-side Worker code.
