# SakthiAI cost policy

SakthiAI uses a free-first execution policy.

## Default lanes

- Normal chat: Cloudflare Workers AI open-source models within the daily free allocation.
- Fresh research: free public-data connectors plus a Workers AI synthesis step.
- Files and persistence: Cloudflare free-tier resources where practical.

## Optional paid lanes

OpenAI, Claude and Gemini are disabled unless `PREMIUM_PROVIDERS_ENABLED=true` is explicitly configured. Unified Billing is optional and is not required for the core SakthiAI roadmap.

## Product rule

Open-source software does not remove compute cost. SakthiAI therefore separates:

1. model licence cost;
2. inference/hosting cost;
3. storage and retrieval cost;
4. optional third-party provider cost.

The public interface must not present a paid provider as available unless the production account is configured and the provider has passed a health check.
