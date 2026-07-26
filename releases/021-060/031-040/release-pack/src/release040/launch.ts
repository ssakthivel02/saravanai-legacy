export type DeploymentWave="internal"|"pilot"|"limited"|"general";
export interface LaunchGate{gateId:string;name:string;required:boolean;status:"pending"|"passed"|"failed"|"waived";evidenceIds:string[];}
export const mayAdvanceWave=(g:LaunchGate[])=>g.every(x=>!x.required||x.status==="passed");
