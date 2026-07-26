import coreWorker from './worker.js';
import { handleFiles } from './files.js';
import { handleOwnerApi } from './owner-api.js';
import { handleGovernance, GOVERNANCE_RELEASE } from './governance.js';
import { handleRuntimeWave1, RUNTIME_WAVE_1_RELEASE } from './runtime-wave1.js';
import { handleRuntimeWave2, RUNTIME_WAVE_2_RELEASE } from './runtime-wave2.js';
import { handleRuntimeWave3, RUNTIME_WAVE_3_RELEASE } from './runtime-wave3.js';
import { handleRuntimeWave4, RUNTIME_WAVE_4_RELEASE } from './runtime-wave4.js';
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
        governanceRelease: GOVERNANCE_RELEASE,
        runtimeWave1Release: RUNTIME_WAVE_1_RELEASE,
        runtimeWave1Enabled: String(env.RUNTIME_WAVE1_ENABLED || '').toLowerCase() === 'true',
        runtimeWave2Release: RUNTIME_WAVE_2_RELEASE,
        runtimeWave2Enabled: String(env.RUNTIME_WAVE2_ENABLED || '').toLowerCase() === 'true',
        runtimeWave2EmergencyStopped: String(env.RUNTIME_WAVE2_EMERGENCY_STOP || 'true').toLowerCase() !== 'false',
        runtimeWave3Release: RUNTIME_WAVE_3_RELEASE,
        runtimeWave3Enabled: String(env.RUNTIME_WAVE3_ENABLED || '').toLowerCase() === 'true',
        runtimeWave3EmergencyStopped: String(env.RUNTIME_WAVE3_EMERGENCY_STOP || 'true').toLowerCase() !== 'false',
        runtimeWave4Release: RUNTIME_WAVE_4_RELEASE,
        runtimeWave4Enabled: String(env.RUNTIME_WAVE4_ENABLED || '').toLowerCase() === 'true',
        runtimeWave4EmergencyStopped: String(env.RUNTIME_WAVE4_EMERGENCY_STOP || 'true').toLowerCase() !== 'false',
        aiRuntime: Boolean(env.AI),
        costPolicy: 'free-first',
        premiumProvidersEnabled: premiumEnabled(env),
        kimiEnabled: Boolean(providerStatus(env).find((provider) => provider.id === 'kimi')?.selectable),
        publicRegistration: false,
        serverTenantWritesEnabled: Boolean(env.SAKTHI_DB) && String(env.PUBLIC_TENANT_WRITES || '').toLowerCase() === 'true'
      }, {
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    if (url.pathname.startsWith('/api/v1/runtime/v4')) return handleRuntimeWave4(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v3')) return handleRuntimeWave3(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v2')) return handleRuntimeWave2(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime')) return handleRuntimeWave1(request, env, url);
    if (url.pathname.startsWith('/api/v1/governance')) return handleGovernance(request, env, url);
    if (url.pathname.startsWith('/api/v1/files')) return handleFiles(request, env, url);
    if (url.pathname.startsWith('/api/v1/platform') || url.pathname === '/api/v1/mobile/config') {
      return handleOwnerApi(request, env, url);
    }
    return coreWorker.fetch(request, env, ctx);
  }
};
