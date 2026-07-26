export { handleRuntimeWave7, RUNTIME_WAVE_7_RELEASE } from './runtime-v7-11/wave7.js';
export { handleRuntimeWave8, RUNTIME_WAVE_8_RELEASE } from './runtime-v7-11/wave8.js';
export { handleRuntimeWave9, RUNTIME_WAVE_9_RELEASE } from './runtime-v7-11/wave9.js';
export { handleRuntimeWave10, RUNTIME_WAVE_10_RELEASE } from './runtime-v7-11/wave10.js';
export { handleRuntimeWave11, RUNTIME_WAVE_11_RELEASE } from './runtime-v7-11/wave11.js';

import { state, ownerBoundary } from './runtime-v7-11/core.js';
import { __testWave7 } from './runtime-v7-11/wave7.js';
import { __testWave8 } from './runtime-v7-11/wave8.js';
import { __testWave9 } from './runtime-v7-11/wave9.js';
import { __testWave10 } from './runtime-v7-11/wave10.js';
import { __testWave11 } from './runtime-v7-11/wave11.js';

const effects = {
  7: { productionWritesEnabled: false },
  8: { productionWritesEnabled: false },
  9: { productionWritesEnabled: false },
  10: { productionWritesEnabled: false },
  11: { productionWritesEnabled: false }
};

export const __test = {
  state: (wave, env) => state(wave, effects[wave], env),
  ownerBoundary,
  ...__testWave7,
  ...__testWave8,
  ...__testWave9,
  ...__testWave10,
  ...__testWave11
};
