export interface ProviderHealth { provider:string; failures:number; latencyP95Ms:number; state:"healthy"|"degraded"|"open"; checkedAt:string; }
export function circuitState(h:ProviderHealth, failed:boolean):ProviderHealth["state"]{
  const failures=failed?h.failures+1:0;
  if(failures>=5)return"open";
  if(failures>=2||h.latencyP95Ms>5000)return"degraded";
  return"healthy";
}
