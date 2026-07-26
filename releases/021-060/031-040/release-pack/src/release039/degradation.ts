export type DependencyMode="normal"|"degraded"|"read_only"|"unavailable";
export function dependencyMode(failureRate:number,latencyP95Ms:number):DependencyMode{if(failureRate>=.5)return"unavailable";if(failureRate>=.2)return"read_only";if(failureRate>=.05||latencyP95Ms>5000)return"degraded";return"normal";}
