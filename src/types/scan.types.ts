export type Prediction = "safe" | "phishing" | "suspicious";
export interface URLScanResult { url:string; prediction:Prediction; confidence:number; riskScore:number; features:Feature[]; explanation:string }
export interface Feature { label:string; value:string; flag:boolean }
export interface EmailScanResult { spamScore:number; phishingProbability:number; prediction:Prediction; extractedLinks:Link[]; explanation:string; flags:string[] }
export interface Link { url:string; risk:"safe"|"danger" }
export interface WebsiteResult { url:string; prediction:Prediction; riskScore:number; ssl:{valid:boolean;issuer:string;expires:string}; domainAge:string; registrar:string; explanation:string }
