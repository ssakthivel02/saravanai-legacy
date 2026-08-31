import type { Decision, RuntimeContext } from "../shared/contracts";
import { secureId } from "../shared/ids";
export interface ModelRoute { provider:"workers-ai"|"local"|"disabled-third-party"; model:string; capability:"chat"|"research"|"embedding"|"classification"; costClass:"free"|"controlled"; supportsCurrentFacts:boolean; }
export interface RouteRequest { capability:ModelRoute["capability"]; requiresCurrentFacts:boolean; containsRestrictedData:boolean; }
export function selectRoute(ctx:RuntimeContext, request:RouteRequest, routes:ModelRoute[]):Decision&{route?:ModelRoute}{
  if(request.containsRestrictedData) return {allowed:false,reason:"restricted_data_route_denied",obligations:["human_review"],decisionId:secureId("route")};
  const route=routes.find(r=>r.capability===request.capability&&r.costClass==="free"&&r.provider!=="disabled-third-party"&&(!request.requiresCurrentFacts||r.supportsCurrentFacts));
  return route?{allowed:true,reason:"compliant_route_selected",obligations:["audit_route"],decisionId:secureId("route"),route}:{allowed:false,reason:"no_compliant_route",obligations:["safe_failure"],decisionId:secureId("route")};
}
