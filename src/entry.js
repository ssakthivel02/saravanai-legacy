import coreWorker from './worker.js';
import { handleFiles } from './files.js';
import { handleOwnerApi } from './owner-api.js';

const ZERO_COST_STATUS_PATHS = new Set(['/api/v1/status', '/api/v1/models', '/api/health', '/api/v1/health']);

async function zeroCostResponse(response) {
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/json')) return response;
  const data = await response.json();
  data.release = '0.11.0';
  data.costPolicy = 'zero-cost-hard-lock';
  data.zeroCostMode = true;
  data.paidProviderCallsAllowed = false;
  data.premiumProvidersEnabled = false;
  if (Array.isArray(data.capabilities)) {
    data.capabilities = data.capabilities
      .filter((item) => item !== 'optional premium web research')
      .concat('paid-provider hard lock');
  }
  return Response.json(data, {
    status: response.status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Request-ID': response.headers.get('X-Request-ID') || crypto.randomUUID()
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/health' || url.pathname === '/healthz')) {
      const healthUrl = new URL('/api/v1/health', url.origin);
      const healthRequest = new Request(healthUrl, {
        method: 'GET',
        headers: request.headers
      });
      return zeroCostResponse(await coreWorker.fetch(healthRequest, env, ctx));
    }

    if (url.pathname.startsWith('/api/v1/files')) return handleFiles(request, env, url);
    if (url.pathname.startsWith('/api/v1/platform') || url.pathname === '/api/v1/mobile/config') {
      return handleOwnerApi(request, env, url);
    }

    const response = await coreWorker.fetch(request, env, ctx);
    if (request.method === 'GET' && ZERO_COST_STATUS_PATHS.has(url.pathname)) return zeroCostResponse(response);
    return response;
  }
};
