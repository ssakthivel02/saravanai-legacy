export interface RecoveryObjective{service:string;rtoMinutes:number;rpoMinutes:number;criticality:"tier0"|"tier1"|"tier2";}
export function validateRecoveryObjective(v:RecoveryObjective):string[]{const e:string[]=[];if(v.rtoMinutes<0||v.rpoMinutes<0)e.push("negative_objective");if(v.criticality==="tier0"&&v.rtoMinutes>60)e.push("tier0_rto_too_high");return e;}
