import coreWorker from './worker.js';
import { handleFiles } from './files.js';
import { handleOwnerApi } from './owner-api.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/health' || url.pathname === '/healthz')) {
      const healthUrl = new URL('/api/v1/health', url.origin);
      const healthRequest = new Request(healthUrl, {
        method: 'GET',
        headers: request.headers
      });
      return coreWorker.fetch(healthRequest, env, ctx);
    }

    if (url.pathname.startsWith('/api/v1/files')) return handleFiles(request, env, url);
    if (url.pathname.startsWith('/api/v1/platform') || url.pathname === '/api/v1/mobile/config') {
      return handleOwnerApi(request, env, url);
    }
    return coreWorker.fetch(request, env, ctx);
  }
};
