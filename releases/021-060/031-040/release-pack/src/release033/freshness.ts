export const isFresh=(retrievedAt:string,maxAgeSeconds:number,now=Date.now())=>{const age=now-new Date(retrievedAt).getTime();return age>=0&&age<=maxAgeSeconds*1000;};
