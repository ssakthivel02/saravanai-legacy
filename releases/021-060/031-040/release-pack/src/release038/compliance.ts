export interface Control{controlId:string;framework:string;statement:string;owner:string;status:"not_assessed"|"gap"|"implemented"|"verified";evidenceIds:string[];}
export const controlCoverage=(c:Control[])=>c.length?c.filter(x=>x.status==="implemented"||x.status==="verified").length/c.length:0;
