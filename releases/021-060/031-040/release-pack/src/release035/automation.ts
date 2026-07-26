export interface AutomationDefinition{automationId:string;tenantId:string;name:string;trigger:{type:"schedule"|"manual"|"condition";expression?:string};action:string;approvalRequired:boolean;enabled:boolean;}
export function canExecuteAutomation(d:AutomationDefinition,approved:boolean):boolean{return d.enabled&&(!d.approvalRequired||approved);}
