export interface TenantSettings{tenantId:string;displayName:string;status:"active"|"suspended"|"closed";dataRegion:string;defaultSensitivity:"internal"|"confidential";quotaProfile:string;}
export function validateTenantSettings(s:TenantSettings):string[]{const e:string[]=[];if(!s.displayName.trim())e.push("display_name_required");if(!s.dataRegion.trim())e.push("data_region_required");return e;}
