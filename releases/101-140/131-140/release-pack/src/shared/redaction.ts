const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gi,/\bghp_[A-Za-z0-9]{30,}\b/g,/\bsk-[A-Za-z0-9]{20,}\b/g,/\b(?:api[_-]?key|token|password)\s*[:=]\s*[^\s,;]+/gi];
export function redactSecrets(v:string):string { return patterns.reduce((o,p)=>o.replace(p,"[REDACTED]"),v); }
