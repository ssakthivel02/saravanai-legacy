export interface ChangeWindow{changeId:string;startsAt:string;endsAt:string;owner:string;rollbackRef:string;approved:boolean;}
export function isWithinApprovedWindow(c:ChangeWindow,now=Date.now()):boolean{return c.approved&&now>=new Date(c.startsAt).getTime()&&now<=new Date(c.endsAt).getTime();}
