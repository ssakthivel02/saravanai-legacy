import { RUNTIME_WAVE_NUMBERS_31_50, getRuntimeWave31To50 } from './runtime-v31-50/catalog.js';
import {
  assessControls,
  evaluateDecisionGate,
  evaluateScenario,
  jsonResponse,
  ownerBoundary,
  parseJson,
  runtimeState,
  safeSideEffects,
  validateEvidence,
  validateException
} from './runtime-v31-50/core.js';

const ROUTE_ACTIONS = Object.freeze({
  'controls/assess': assessControls,
  'evidence/validate': validateEvidence,
  'scenario/evaluate': evaluateScenario,
  'exception/validate': validateException,
  'decision/gate': evaluateDecisionGate
});

function parseWavePath(pathname) {
  const match = pathname.match(/^\/api\/v1\/runtime\/v(3[1-9]|4[0-9]|50)(?:\/(.*))?$/);
  if (!match) return null;
  return {
    number: Number(match[1]),
    action: match[2] || ''
  };
}

export function runtimeWaves31To50Health(env = {}) {
  const health = {};
  for (const number of RUNTIME_WAVE_NUMBERS_31_50) {
    const wave = getRuntimeWave31To50(number);
    const state = runtimeState(number, env);
    health[`runtimeWave${number}Release`] = `runtime-wave-${number}.0.0`;
    health[`runtimeWave${number}Title`] = wave.title;
    health[`runtimeWave${number}Enabled`] = state.enabled;
    health[`runtimeWave${number}EmergencyStopped`] = state.emergencyStopped;
  }
  return health;
}

export async function handleRuntimeWaves31To50(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  const parsedPath = parseWavePath(url.pathname);

  if (!parsedPath) {
    return jsonResponse(
      { error: 'Runtime Waves 31–50 route not found.', code: 'RUNTIME_WAVES_31_50_ROUTE_NOT_FOUND' },
      404,
      requestId
    );
  }

  const wave = getRuntimeWave31To50(parsedPath.number);
  if (!wave) {
    return jsonResponse(
      { error: 'Runtime wave is not defined.', code: 'RUNTIME_WAVE_NOT_DEFINED' },
      404,
      requestId
    );
  }

  const state = runtimeState(parsedPath.number, env);
  if (request.method === 'GET' && parsedPath.action === 'status') {
    return jsonResponse({
      status: 'ok',
      release: `runtime-wave-${parsedPath.number}.0.0`,
      wave: parsedPath.number,
      title: wave.title,
      slug: wave.slug,
      enabled: state.enabled,
      emergencyStopped: state.emergencyStopped,
      operational: state.operational,
      mode: wave.mode,
      activation: state.operational ? 'owner-pilot' : 'disabled-or-emergency-stopped',
      publicRegistration: false,
      metadataOnly: true,
      ...safeSideEffects()
    }, 200, requestId);
  }

  const boundary = ownerBoundary(request, env);
  if (!boundary.allowed) {
    return jsonResponse({
      error: boundary.code,
      code: boundary.code,
      publicRegistration: false
    }, boundary.status, requestId);
  }

  if (!state.enabled) {
    return jsonResponse({
      error: `Runtime Wave ${parsedPath.number} is installed but disabled.`,
      code: `RUNTIME_WAVE_${parsedPath.number}_DISABLED`
    }, 503, requestId);
  }

  if (state.emergencyStopped) {
    return jsonResponse({
      error: `Runtime Wave ${parsedPath.number} is under emergency stop.`,
      code: `RUNTIME_WAVE_${parsedPath.number}_EMERGENCY_STOPPED`
    }, 503, requestId);
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      { error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' },
      405,
      requestId
    );
  }

  const evaluator = ROUTE_ACTIONS[parsedPath.action];
  if (!evaluator) {
    return jsonResponse({
      error: `Runtime Wave ${parsedPath.number} action was not found.`,
      code: `RUNTIME_WAVE_${parsedPath.number}_ACTION_NOT_FOUND`
    }, 404, requestId);
  }

  const parsed = await parseJson(request, requestId);
  if (parsed.error) return parsed.error;

  const result = evaluator(wave, parsed.body);
  return jsonResponse({
    release: `runtime-wave-${parsedPath.number}.0.0`,
    wave: parsedPath.number,
    title: wave.title,
    result
  }, result.valid === false ? 422 : 200, requestId);
}

export const __test = {
  parseWavePath,
  ROUTE_ACTIONS
};
