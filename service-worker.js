const CACHE='saravanai-owner-v20-postcutover';
const CORE=['/','/index.html','/assets/styles.css','/assets/release002.css','/assets/release003.css','/assets/owner-platform.css','/assets/owner-security.css','/assets/voice-input.css','/assets/access-readiness.css','/assets/access-role-policy.css','/assets/access-authorisation.css','/assets/tenant-persistence.css','/assets/tenant-lifecycle.css','/assets/app.js','/assets/owner-platform.js','/assets/profile-context.js','/assets/profile-bootstrap.js','/assets/voice-input.js','/assets/access-readiness.js','/assets/access-role-policy.js','/assets/access-authorisation.js','/assets/tenant-persistence.js','/assets/tenant-lifecycle.js','/assets/artifact-formats.js','/assets/zip.js','/assets/task-capture.js','/assets/release-labels.js','/assets/owner-security.js','/assets/favicon.svg','/manifest.webmanifest','/offline.html'];

self.addEventListener('install',(event)=>{
  event.waitUntil(caches.open(CACHE).then((cache)=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',(event)=>{
  event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.filter((key)=>key!==CACHE).map((key)=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',(event)=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(event.request).then((response)=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then((cache)=>cache.put(event.request,copy));
      }
      return response;
    }).catch(()=>caches.match(event.request).then((hit)=>hit||caches.match('/offline.html')))
  );
});
