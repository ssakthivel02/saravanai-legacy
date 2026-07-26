export interface Attestation{attestationId:string;controlId:string;attestor:string;conclusion:"effective"|"partially_effective"|"ineffective";evidenceIds:string[];signedAt:string;}
