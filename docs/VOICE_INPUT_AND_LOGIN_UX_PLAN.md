# Voice Input and Login UX Plan

## Delivered in this release

- Progressive browser speech-to-text for the main SakthiAI task composer.
- English (UK), English (India) and Tamil (India) language choices.
- Explicit start and stop control.
- Transcript insertion into the editable prompt field.
- No automatic submission.
- No audio persistence by SakthiAI.
- Clear unsupported-browser fallback to device keyboard dictation.
- Same-origin microphone permission policy.
- Removal of year-long immutable caching from non-fingerprinted assets so new releases do not remain visually stale.
- Visible build and identity copy aligned with the verified profile-isolation foundation.

## Privacy boundary

The first-stage voice feature uses the browser's speech recognition implementation. Depending on the browser and device, audio may be sent to the browser vendor's recognition service. SakthiAI does not receive or store the recording in this mode. The interface discloses this before use.

A later SakthiAI-controlled transcription endpoint may use Cloudflare Workers AI Whisper. That endpoint is not enabled by this release and must include authenticated access, duration limits, MIME validation, rate limiting, deletion guarantees and daily free-allocation controls before deployment.

## Recommended authentication experience for up to 50 invited users

Use Cloudflare Access as the identity-aware proxy and Google as the primary identity provider. Users do not need Cloudflare accounts; they authenticate with their existing Google accounts. Keep email one-time PIN available only as a controlled fallback for invited addresses.

Recommended first release:

- Public landing page with product explanation, privacy links and a **Log in** button.
- **Request access** instead of unrestricted **Sign up**.
- Protected workspace path or subdomain behind Cloudflare Access.
- Exact-email invitation policy.
- Google sign-in as the default login method.
- Email OTP only for explicitly approved users who cannot use Google.
- Owner and member roles initially.
- Separate browser-local profile namespace after verified login.
- No public self-service registration.

## Why not store passwords in SakthiAI

A custom password system would make SakthiAI responsible for password hashing, credential storage, email verification, password-reset tokens, compromised-password controls, brute-force defence, MFA recovery, session revocation and incident response. Cloudflare Access and established identity providers already supply these controls more safely.

## Profile behaviour after login

The current foundation automatically selects a separate browser-local database and privacy-lock namespace for each cryptographically verified identity. This is appropriate for an invited pilot. It does not yet provide cross-device synchronisation.

A later D1 profile release should add:

- stable user subject identifier
- tenant and membership records
- owner, admin, member, viewer and auditor roles
- per-resource ownership and authorisation
- invitation, suspension and revocation
- cross-device projects and conversations
- export and account deletion
- security and usage audit records

## UI cleanup rationale

The repository previously marked `/assets/*` as immutable for one year while continuing to reuse the same filenames. That combination can leave old release labels and JavaScript visible after a successful deployment. Until content-hashed filenames are introduced, assets now require revalidation instead of immutable caching.

The governance controls for browser-held keys, paid calls, automatic memory and public registration remain visible intentionally. They are product trust controls, not unfinished decoration. Their state should change only when the corresponding feature is safely implemented and approved.
