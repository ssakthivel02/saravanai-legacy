import coreWorker from './worker.js';
import { handleFiles } from './files.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/v1/files')) {
      return handleFiles(request, env, url);
    }
    return coreWorker.fetch(request, env, ctx);
  }
};
