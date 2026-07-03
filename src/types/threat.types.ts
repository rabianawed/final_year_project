export type Severity = "critical"|"high"|"medium"|"low";
export interface ThreatEntry { domain:string; type:string; severity:Severity; ip:string; country:string; firstSeen:string }
export interface ThreatStats { activeThreats:number; maliciousDomains:number; flaggedIPs:number; countriesAffected:number }
