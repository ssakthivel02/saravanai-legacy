export type SourceQuality="authoritative"|"primary"|"secondary"|"community"|"unknown";
export interface ResearchSource{sourceId:string;url:string;title:string;quality:SourceQuality;publishedAt?:string;retrievedAt:string;contentHash:string;}
export interface Claim{claimId:string;text:string;sourceIds:string[];confidence:number;currentFact:boolean;verifiedAt:string;}
export function validateClaim(c:Claim):string[]{const e:string[]=[];if(!c.sourceIds.length)e.push("source_required");if(c.confidence<0||c.confidence>1)e.push("confidence_out_of_range");if(c.currentFact&&!c.verifiedAt)e.push("verification_time_required");return e;}
