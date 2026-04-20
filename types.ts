
export interface Skill {
  name: string;
  type: string;
  proficiency: number;
}

export interface RecommendedJob {
  jobName: string;
  fit: number;
  reason: string;
  fitAnalysis: string;
  strengths: string[];
}

export interface ExpandedJob {
  industry: string;
  jobName: string;
  fitScore: number;
  reason: string;
  synergy: string;
}

export interface CareerModel {
  type: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  description: string;
  suitability: string;
  pros: string[];
  cons: string[];
}

export interface AnalysisResult {
  skills: Skill[];
  recommendedJobs: RecommendedJob[];
  expandedJobs: ExpandedJob[];
  models: CareerModel[];
}

export interface RoadmapDetails {
  careerDev: string;
  jobPrep: string;
  searchStrategy: string;
  riskMgmt: string;
}

export interface RoadmapItem {
  period: string;
  action: string;
  details: RoadmapDetails | string;
}

export interface UpskillingItem {
  category: string;
  action: string;
  method: string;
}

export interface JobHuntStrategy {
  channels: string[];
  resumeTips: string[];
  interviewTips: string[];
}

export interface RiskManagement {
  risk: string;
  mitigation: string;
}

export interface ResourceRecommendation {
  title: string;
  type: 'Course' | 'Article' | 'Certification';
  platform: string;
  link: string;
  reason: string;
}

export interface StrategyResult {
  roadmap: RoadmapItem[];
  upskilling: UpskillingItem[];
  jobHunt: JobHuntStrategy;
  risks: RiskManagement[];
  resources: ResourceRecommendation[];
}

export interface CareerFile {
  mimeType: string;
  data: string;
  name: string;
}

export interface CareerInput {
  text: string;
  files: CareerFile[];
}

export type Step = 'LANDING' | 'INPUT' | 'ANALYZING' | 'JOB_SELECTION' | 'MODEL_SELECTION' | 'DASHBOARD';
