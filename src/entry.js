import coreWorker from './worker.js';
import { handleFiles } from './files.js';
import { handleOwnerApi } from './owner-api.js';
import { handleGovernance, GOVERNANCE_RELEASE } from './governance.js';
import { handleRuntimeWave1, RUNTIME_WAVE_1_RELEASE } from './runtime-wave1.js';
import { handleRuntimeWave2, RUNTIME_WAVE_2_RELEASE } from './runtime-wave2.js';
import { handleRuntimeWave3, RUNTIME_WAVE_3_RELEASE } from './runtime-wave3.js';
import { handleRuntimeWave4, RUNTIME_WAVE_4_RELEASE } from './runtime-wave4.js';
import { handleRuntimeWave5, RUNTIME_WAVE_5_RELEASE } from './runtime-wave5.js';
import { handleRuntimeWave6, RUNTIME_WAVE_6_RELEASE } from './runtime-wave6.js';
import {
  handleRuntimeWave7, RUNTIME_WAVE_7_RELEASE,
  handleRuntimeWave8, RUNTIME_WAVE_8_RELEASE,
  handleRuntimeWave9, RUNTIME_WAVE_9_RELEASE,
  handleRuntimeWave10, RUNTIME_WAVE_10_RELEASE,
  handleRuntimeWave11, RUNTIME_WAVE_11_RELEASE
} from './runtime-waves7-11.js';
import { handleRuntimeWaves12To30, runtimeWaves12To30Health } from './runtime-waves12-30.js';
import { handleRuntimeWaves31To50, runtimeWaves31To50Health } from './runtime-waves31-50.js';
import { handleRuntimeProgrammeControl, runtimeProgrammeHealth } from './runtime-programme-control.js';
import { accessJwtEnforcementEnabled, enforceAccessJwt } from './access-jwt.js';
import { RELEASE, premiumEnabled, providerStatus } from './router.js';

const enabled = (env, name) => String(env[name] || '').toLowerCase() === 'true';
const stopped = (env, name) => String(env[name] || 'true').toLowerCase() !== 'false';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const access = await enforceAccessJwt(request, env, url);
    if (access.response) return access.response;
    request = access.request;

    if (request.method === 'GET' && url.pathname === '/health') {
      return Response.json({
        status: 'ok',
        service: 'sakthi-ai-nexus',
        environment: 'production',
        release: RELEASE,
        governanceRelease: GOVERNANCE_RELEASE,
        runtimeWave1Release: RUNTIME_WAVE_1_RELEASE,
        runtimeWave1Enabled: enabled(env, 'RUNTIME_WAVE1_ENABLED'),
        runtimeWave2Release: RUNTIME_WAVE_2_RELEASE,
        runtimeWave2Enabled: enabled(env, 'RUNTIME_WAVE2_ENABLED'),
        runtimeWave2EmergencyStopped: stopped(env, 'RUNTIME_WAVE2_EMERGENCY_STOP'),
        runtimeWave3Release: RUNTIME_WAVE_3_RELEASE,
        runtimeWave3Enabled: enabled(env, 'RUNTIME_WAVE3_ENABLED'),
        runtimeWave3EmergencyStopped: stopped(env, 'RUNTIME_WAVE3_EMERGENCY_STOP'),
        runtimeWave4Release: RUNTIME_WAVE_4_RELEASE,
        runtimeWave4Enabled: enabled(env, 'RUNTIME_WAVE4_ENABLED'),
        runtimeWave4EmergencyStopped: stopped(env, 'RUNTIME_WAVE4_EMERGENCY_STOP'),
        runtimeWave5Release: RUNTIME_WAVE_5_RELEASE,
        runtimeWave5Enabled: enabled(env, 'RUNTIME_WAVE5_ENABLED'),
        runtimeWave5EmergencyStopped: stopped(env, 'RUNTIME_WAVE5_EMERGENCY_STOP'),
        runtimeWave6Release: RUNTIME_WAVE_6_RELEASE,
        runtimeWave6Enabled: enabled(env, 'RUNTIME_WAVE6_ENABLED'),
        runtimeWave6EmergencyStopped: stopped(env, 'RUNTIME_WAVE6_EMERGENCY_STOP'),
        runtimeWave7Release: RUNTIME_WAVE_7_RELEASE,
        runtimeWave7Enabled: enabled(env, 'RUNTIME_WAVE7_ENABLED'),
        runtimeWave7EmergencyStopped: stopped(env, 'RUNTIME_WAVE7_EMERGENCY_STOP'),
        runtimeWave8Release: RUNTIME_WAVE_8_RELEASE,
        runtimeWave8Enabled: enabled(env, 'RUNTIME_WAVE8_ENABLED'),
        runtimeWave8EmergencyStopped: stopped(env, 'RUNTIME_WAVE8_EMERGENCY_STOP'),
        runtimeWave9Release: RUNTIME_WAVE_9_RELEASE,
        runtimeWave9Enabled: enabled(env, 'RUNTIME_WAVE9_ENABLED'),
        runtimeWave9EmergencyStopped: stopped(env, 'RUNTIME_WAVE9_EMERGENCY_STOP'),
        runtimeWave10Release: RUNTIME_WAVE_10_RELEASE,
        runtimeWave10Enabled: enabled(env, 'RUNTIME_WAVE10_ENABLED'),
        runtimeWave10EmergencyStopped: stopped(env, 'RUNTIME_WAVE10_EMERGENCY_STOP'),
        runtimeWave11Release: RUNTIME_WAVE_11_RELEASE,
        runtimeWave11Enabled: enabled(env, 'RUNTIME_WAVE11_ENABLED'),
        runtimeWave11EmergencyStopped: stopped(env, 'RUNTIME_WAVE11_EMERGENCY_STOP'),
        ...runtimeWaves12To30Health(env),
        ...runtimeWaves31To50Health(env),
        ...runtimeProgrammeHealth(env),
        accessJwtEnforcementEnabled: accessJwtEnforcementEnabled(env),
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
    if (url.pathname === '/runtime/control-centre' || url.pathname.startsWith('/api/v1/runtime/programme')) {
      return handleRuntimeProgrammeControl(request, env, url);
    }
    if (/^\/api\/v1\/runtime\/v(?:3[1-9]|4[0-9]|50)(?:\/|$)/.test(url.pathname)) {
      return handleRuntimeWaves31To50(request, env, url);
    }
    if (/^\/api\/v1\/runtime\/v(?:1[2-9]|2[0-9]|30)(?:\/|$)/.test(url.pathname)) {
      return handleRuntimeWaves12To30(request, env, url);
    }
    if (url.pathname.startsWith('/api/v1/runtime/v11')) return handleRuntimeWave11(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v10')) return handleRuntimeWave10(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v9')) return handleRuntimeWave9(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v8')) return handleRuntimeWave8(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v7')) return handleRuntimeWave7(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v6')) return handleRuntimeWave6(request, env, url);
    if (url.pathname.startsWith('/api/v1/runtime/v5')) return handleRuntimeWave5(request, env, url);
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
