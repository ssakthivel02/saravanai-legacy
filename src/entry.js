import coreWorker from './worker.js';
import { handleFiles } from './files.js';
import { handleOwnerApi } from './owner-api.js';
import { RELEASE, premiumEnabled, providerStatus } from './router.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return Response.json({
        status: 'ok',
        service: 'sakthi-ai-nexus',
        environment: 'production',
        release: RELEASE,
        aiRuntime: Boolean(env.AI),
        costPolicy: 'free-first',
        premiumProvidersEnabled: premiumEnabled(env),
        kimiEnabled: Boolean(providerStatus(env).find((provider) => provider.id === 'kimi')?.selectable),
        publicRegistration: false
      }, {
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    if (url.pathname.startsWith('/api/v1/files')) return handleFiles(request, env, url);
    if (url.pathname.startsWith('/api/v1/platform') || url.pathname === '/api/v1/mobile/config') {
      return handleOwnerApi(request, env, url);
    }
    return coreWorker.fetch(request, env, ctx);
  }
};
