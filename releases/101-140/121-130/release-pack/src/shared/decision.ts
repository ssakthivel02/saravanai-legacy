export interface PolicyDecision { allowed:boolean; reason:string; obligations:string[]; }
export function deny(reason:string,...obligations:string[]):PolicyDecision { return {allowed:false,reason,obligations}; }
export function allow(reason:string,...obligations:string[]):PolicyDecision { return {allowed:true,reason,obligations}; }
