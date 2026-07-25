const CACHE='sakthiai-owner-v11';
const CORE=['/','/index.html','/assets/styles.css','/assets/release002.css','/assets/release003.css','/assets/owner-platform.css','/assets/app.js','/assets/owner-platform.js','/assets/artifact-formats.js','/assets/zip.js','/assets/task-capture.js','/assets/release011-hardening.js','/assets/favicon.svg','/manifest.webmanifest','/offline.html'];

self.addEventListener('install',(event)=>{
  event.waitUntil(caches.open(CACHE).then((cache)=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',(event)=>{
  event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.filter((key)=>key!==CACHE).map((key)=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',(event)=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.pathname.startsWith('/api/')||url.pathname==='/health'||url.pathname==='/healthz') return;
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
